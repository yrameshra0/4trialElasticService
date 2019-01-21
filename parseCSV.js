const fs = require('fs');
const elasticSearch = require('elasticsearch');
const client = new elasticSearch.Client({
    host: 'localhost:9200',
    log: 'trace'
});

function parseFile(fileName){
    const creditsString = fs.readFileSync(`./${fileName}.csv`).toString('ascii');
    const creditsArray = creditsString.split('\n');
    const firstRow = creditsArray.slice(0, 1).reduce((acc, val) => {
        return val.split(',');
    }, []);
    const allRows = creditsArray.slice(1, creditsArray.length).reduce((acc, val) => {
        acc.push(val.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/));
        return acc;
    }, []);
    const jsonObjects = [];
    allRows.forEach(row => {
        let json = {};
        row.forEach((val, index) => {
            try {
                const replacer = val.replace(/""/g, '"').replace(/^"(.+(?="$))"$/g, '$1');
                json[firstRow[index]] = JSON.parse(replacer);
            } catch (err) {
                json[firstRow[index]] = val;
            }
        });
        jsonObjects.push(json);
    });
    const finalConvertedValue = jsonObjects[0];
    console.log(finalConvertedValue.cast.length)
    return jsonObjects;
}

async function init() {
    const result = await client.ping({ requestTimeout: 1000 })
    const jsonObjects = parseFile('tmdb_5000_credits');
    const awaiter = [];
    // await resetIndex();
    // findAll(awaiter);
    // printAllNames(jsonObjects);
    // search(awaiter, "Taylor");
    savingDocuments(awaiter, jsonObjects);
    try {
        await Promise.all(awaiter);
    }
    catch (err) {
        console.error(err);
    }
}

async function resetIndex () {
    const index = "movies"
    if (await client.indices.exists({ index })) {
      await client.indices.delete({ index })
    }
  
    await client.indices.create({ index })
    await putMapping()
  }

async function putMapping() {
    const schema = {
        name: { type: 'keyword' },
    }
    const index = "movies";
    const type = "cast";
    return client.indices.putMapping({ index, type, body: { properties: schema } })
}
async function deleteIndex(awaiter) {
    awaiter.push(client.indices.delete({ index: "movies" }));
    return awaiter;
}

async function search(awaiter, term, offset = 0) {
    const index = "movies";
    const body = 
    {
        "query": {
            "wildcard" : {
                "name" : `*${term}*`
            }
        },
        "_source": ["name", "title"],
    };    
    awaiter.push(client.search({ index, body }));
    return awaiter;
}

async function findAll(awaiter) {
    awaiter.push(client.search({
        index: 'movies',
        body: {
            query: {
                "match_all": {}
            }
        }
    }));
    return awaiter;
}
function printAllNames(jsonObjects) {
    for (movieInfo of jsonObjects) {
        movieInfo.cast.forEach(
            castMember => {
                const {
                    movie_id,
                    title
                } = movieInfo;
                const {
                    cast_id,
                    character,
                    name,
                    gender
                } = castMember;
                console.log(
                    name
                );
            }
        );
    }
}
async function savingDocuments(awaiter, jsonObjects) {
    const bulkArray = [];
    for (movieInfo of jsonObjects) {
        console.log(`Saving CAST Movie ${movieInfo.movie_id}`);
        movieInfo.cast.forEach(castMember => {
            const { movie_id, title } = movieInfo;
            const { cast_id, character, name, gender } = castMember;

            bulkArray.push({
                index: {
                    _index: 'movies', _type: 'cast', _id: `movie_id-${movie_id}--cast_id-${cast_id}`
                }
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
    }
    const processingPromise = new Promise(async (resolve, reject)=>{
        const totalBulkToProcess = bulkArray.length;
        const batchSize = 6;
        let currentlyAt = 0
        while(currentlyAt<=(totalBulkToProcess-batchSize)){
            const batch = bulkArray.slice(currentlyAt, (currentlyAt+batchSize));
            try{
            await client.bulk({ body: batch })
            }catch(err){
                console.error(`Failed processing batch ${err}`)
                reject(err)
            }
            currentlyAt += batch.length;
        }
        resolve();
    });
    
    awaiter.push(processingPromise);
    return awaiter;
}

setImmediate(async () => init());