/* eslint-disable no-unused-vars */
const fs = require('fs');
const elasticSearch = require('elasticsearch');

const client = new elasticSearch.Client({
  host: 'localhost:9200',
  log: 'trace',
});

/* eslint-disable camelcase */
function flattenCredits(batchToUpload) {
  const bulkArray = [];
  batchToUpload.forEach((movieInfo) => {
    console.log(`Saving CAST Movie ${movieInfo.movie_id}`);
    movieInfo.cast.forEach((castMember) => {
      const { movie_id, title } = movieInfo;
      const {
        cast_id, character, name, gender,
      } = castMember;

      bulkArray.push({
        index: {
          _index: 'movies', _type: 'cast', _id: `movie_id-${movie_id}--cast_id-${cast_id}`,
        },
      });
      bulkArray.push({
        movie_id,
        title,
        cast_id,
        character,
        name,
        gender,
      });
    });
  });

  return bulkArray;
}


function flattenMovies(batchToUpload) {
  const bulkArray = [];
  batchToUpload.forEach((movieInfo) => {
    console.log(`Saving Movie ${movieInfo.id}`);
    const { title, id, original_language } = movieInfo;

    bulkArray.push({
      index: {
        _index: 'movies', _type: 'movie', _id: `movie_id-${id}`,
      },
    });
    bulkArray.push({
      id,
      title,
      original_language,
    });
  });

  return bulkArray;
}

function pointerConfig(fileName, flattenFunc) {
  return {
    data: {
      buffer: [],
      readComplete: false,
      uploadComplete: false,
    },
    source: {
      csvFile: fileName,
      csvHeader: [],
      lineBuffer: '',
    },
    sink: {
      batchSize: 5,
      interval: 100,
      onGoing: false,
      maxRetries: 3,
      errorRetries: 0,
      flattenFunc,
    },
  };
}

const configPointer = {
  credits: pointerConfig('tmdb_5000_credits.csv', flattenCredits),
  movies: pointerConfig('smaller.csv', flattenMovies),
};

function parseFileStream(pointerKey) {
  const pointer = configPointer[pointerKey];
  const { source, data } = pointer;
  const stream = fs.createReadStream(source.csvFile, { flags: 'r', encoding: 'utf-8' });
  return new Promise((resolve, reject) => {
    function processLine(line) {
      if (line.length > 0) {
        if (source.csvHeader.length === 0) { // header
          source.csvHeader = line.split(',');
        } else {
          const dataRow = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
          const firstRow = source.csvHeader;
          const json = {};
          dataRow.forEach((val, index) => {
            try {
              const replacer = val.replace(/""/g, '"').replace(/^"(.+(?="$))"$/g, '$1');
              json[firstRow[index]] = JSON.parse(replacer);
            } catch (err) {
              json[firstRow[index]] = val;
            }
          });
          data.buffer.push(json);
        }
      }
    }

    function pump() {
      const eolPosition = () => source.lineBuffer.indexOf('\n');
      while (eolPosition() >= 0) {
        processLine(source.lineBuffer.slice(0, eolPosition()));
        source.lineBuffer = source.lineBuffer.slice(eolPosition() + 1);
      }
    }


    stream.on('data', (dataOnStream) => {
      source.lineBuffer += dataOnStream.toString();
      pump();
    });

    stream.on('close', () => {
      data.readComplete = true;
      resolve();
    });

    stream.on('error', () => {
      data.readComplete = true;
      reject();
    });
  });
}

async function uploadExpandedItemsInBatches(dataForUpload) {
  return new Promise(async (resolve, reject) => {
    const totalBulkToProcess = dataForUpload.length;
    const batchSize = 6;
    let currentlyAt = 0;
    while (currentlyAt <= (totalBulkToProcess - batchSize)) {
      const batch = dataForUpload.slice(currentlyAt, (currentlyAt + batchSize));
      try {
        await client.bulk({ body: batch });
      } catch (err) {
        console.error(`Failed processing batch ${err}`);
        reject(err);
      }
      currentlyAt += batch.length;
    }
    resolve();
  });
}

function uploadData(pointerKey) {
  const pointer = configPointer[pointerKey];
  const { data, sink } = pointer;
  return new Promise((resolve, reject) => {
    let interval;

    async function uploadToSink() {
      // Stopping the upload and resolving the promise
      if (data.uploadComplete) {
        clearInterval(interval);
        resolve();
        return;
      }

      // Backing off, already processing chunk
      if (sink.onGoing) return;

      const batchToUpload = data.buffer.splice(0, sink.batchSize);

      // No data for upload we can safely resolve the promise
      if (batchToUpload.length === 0 && data.readComplete === true) {
        data.uploadComplete = true;
      } else if (batchToUpload.length !== 0) {
        const dataForUpload = sink.flattenFunc(batchToUpload);
        try {
          sink.onGoing = true;
          await uploadExpandedItemsInBatches(dataForUpload);
          // Recovered from error switching back counters
          if (sink.errorRetries !== 0) { sink.errorRetries = 0; }
        } catch (err) {
          // Exhausted maximum retries downstream not recovered
          if (sink.errorRetries > sink.maxRetries) {
            reject(err);
            return;
          }

          console.error(`Failed processing batch ${err}`);
          // Moving the chunk back of buffer for retry
          data.buffer.concat(dataForUpload);
        } finally {
          sink.onGoing = false;
        }
      }
    }

    interval = setInterval(uploadToSink, sink.interval);
  });
}

async function init() {
  const result = await client.ping({ requestTimeout: 1000 });
  // const jsonObjects = parseFile('tmdb_5000_credits');
  const awaiter = [];
  awaiter.push(parseFileStream('movies'));
  awaiter.push(uploadData('movies'));
  // await resetIndex();
  // findAll(awaiter);
  // printAllNames(jsonObjects);
  // search(awaiter, "Taylor");
  // savingDocuments(awaiter, jsonObjects);
  try {
    await Promise.all(awaiter);
  } catch (err) {
    console.error(err);
  }
}

async function putMapping() {
  const schema = {
    name: { type: 'keyword' },
  };
  const index = 'movies';
  const type = 'cast';
  return client.indices.putMapping({ index, type, body: { properties: schema } });
}

async function resetIndex() {
  const index = 'movies';
  if (await client.indices.exists({ index })) {
    await client.indices.delete({ index });
  }

  await client.indices.create({ index });
  await putMapping();
}


async function deleteIndex(awaiter) {
  awaiter.push(client.indices.delete({ index: 'movies' }));
  return awaiter;
}

async function search(awaiter, term, offset = 0) {
  const index = 'movies';
  const body = {
    query: {
      wildcard: {
        name: `*${term}*`,
      },
    },
    _source: ['name', 'title'],
  };
  awaiter.push(client.search({ index, body }));
  return awaiter;
}

async function findAll(awaiter) {
  awaiter.push(client.search({
    index: 'movies',
    body: {
      query: {
        match_all: {},
      },
    },
  }));
  return awaiter;
}

setImmediate(async () => init());
