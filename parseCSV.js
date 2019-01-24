/* eslint-disable no-unused-vars */
const fs = require('fs');
const elasticSearch = require('elasticsearch');

const client = new elasticSearch.Client({
  host: 'localhost:9200',
  log: 'trace',
});

/* eslint-disable camelcase */
function flattenCredits(movieInfo) {
  const bulkArray = [];

  //   console.log(`Saving CAST Movie ${movieInfo.movie_id}`);
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

  return bulkArray;
}


function flattenMovies(movieInfo) {
  const bulkArray = [];
  //   console.log(`Saving Movie ${movieInfo.id}`);
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

  return bulkArray;
}

const configPointer = {
  credits: {
    csvFile: 'tmdb_5000_credits.csv',
    csvHeader: [],
    lineBuffer: '',
    flattenFunc: flattenCredits,
  },
  movies: {
    csvFile: 'tmdb_5000_movies.csv',
    csvHeader: [],
    lineBuffer: '',
    flattenFunc: flattenMovies,
  },
  sink: {
    uploadBuffer: [],
    emptyUploadTries: 0,
    batchSize: 100,
    interval: 100,
    onGoing: false,
    maxRetries: 3,
    errorRetries: 0,
  },
};

function parseFileStream(pointerKey) {
  const pointer = configPointer[pointerKey];

  const stream = fs.createReadStream(pointer.csvFile, { flags: 'r', encoding: 'utf-8' });
  return new Promise((resolve, reject) => {
    function processLine(line) {
      const { uploadBuffer } = configPointer.sink;
      if (line.length <= 0) return;
      if (pointer.csvHeader.length === 0) { // header
        pointer.csvHeader = line.split(',');
        return;
      }
      const dataRow = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
      const firstRow = pointer.csvHeader;
      const json = {};
      dataRow.forEach((val, index) => {
        try {
          const replacer = val.replace(/""/g, '"').replace(/^"(.+(?="$))"$/g, '$1');
          json[firstRow[index]] = JSON.parse(replacer);
        } catch (err) {
          json[firstRow[index]] = val;
        }
      });

      uploadBuffer.push(...pointer.flattenFunc(json));
    }

    function pump() {
      const eolPosition = () => pointer.lineBuffer.indexOf('\n');
      while (eolPosition() >= 0) {
        processLine(pointer.lineBuffer.slice(0, eolPosition()));
        pointer.lineBuffer = pointer.lineBuffer.slice(eolPosition() + 1);
      }
    }

    stream.on('data', (dataOnStream) => {
      pointer.lineBuffer += dataOnStream.toString();
      pump();
    });

    stream.on('close', () => {
      resolve();
    });

    stream.on('error', () => {
      reject();
    });
  });
}

function uploadData() {
  const { interval, batchSize, maxRetries } = configPointer.sink;
  let {
    emptyUploadTries,
    onGoing,
    uploadBuffer,
    errorRetries,
  } = configPointer.sink;
  return new Promise((resolve, reject) => {
    let scheduledInterval;

    async function uploadToSink() {
      // Stopping the upload and resolving the promise
      if (emptyUploadTries >= interval) {
        clearInterval(scheduledInterval);
        resolve();
        return;
      }

      // Backing off, already processing chunk
      if (onGoing) return;

      // multiplier 2 because each upload element has additional meta info item
      const currentBatchSize = batchSize * 2;
      const batchToUpload = uploadBuffer.splice(0, currentBatchSize);
      console.log(`Current Upload Buffer Size -- ${uploadBuffer.length}`);
      // No data for upload we can safely resolve the promise
      if (batchToUpload.length === 0) {
        emptyUploadTries += 1;
        // console.log(`Backing off ${emptyUploadTries}`);
        return;
      }

      try {
        onGoing = true;
        await client.bulk({ body: batchToUpload });
        // Recovered from error switching back counters
        if (errorRetries !== 0) { errorRetries = 0; }
      } catch (err) {
        // Exhausted maximum retries downstream not recovered
        if (errorRetries > maxRetries) {
          reject(err);
          return;
        }

        console.error(`Failed processing batch ${err}`);
        // Moving the chunk back of buffer for retry
        uploadBuffer = uploadBuffer.concat(batchToUpload);
        errorRetries += 1;
      } finally {
        onGoing = false;
      }
    }

    scheduledInterval = setInterval(uploadToSink, interval);
  });
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

async function init() {
  const result = await client.ping({ requestTimeout: 1000 });
  // const jsonObjects = parseFile('tmdb_5000_credits');
  const awaiter = [];
  // awaiter.push(uploadData());
  // parseFileStream('movies');
  // parseFileStream('credits');

  // await resetIndex();
  // findAll(awaiter);
  // printAllNames(jsonObjects);
  // search(awaiter, 'Taylor');
  // savingDocuments(awaiter, jsonObjects);
  try {
    await Promise.all(awaiter);
  } catch (err) {
    console.error(err);
  }
}
setImmediate(async () => init());
