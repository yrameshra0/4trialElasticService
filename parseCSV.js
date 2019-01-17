const fs = require('fs');
const elasticSearch = require('elasticsearch');
const client = new elasticSearch.Client({
    host: 'localhost:9200',
    log: 'debug'
});

async function init() {
    const result = await client.ping({ requestTimeout: 1000 });
    const creditsString = fs.readFileSync('./smallers.csv').toString('ascii');
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
    const awaiter = [];
    for (movieInfo of jsonObjects) {
        movieInfo.cast.forEach(castMember => {
            console.log(`Saving Movie ${movieInfo.movie_id} for Cast Member ${castMember.name}`)
            const promise = client.create({
                index: 'movies',
                type: 'cast',
                id: `movie_id-${movieInfo.movie_id}:cast_id-${castMember.cast_id}`,
                body: movieInfo
            });
            awaiter.push(promise);
        });
    }
    // console.log(JSON.stringify(finalConvertedValue));
    try {
        await Promise.all(awaiter);
    }
    catch (err) {
        console.error(err);
    }
}

setImmediate(async () => init());