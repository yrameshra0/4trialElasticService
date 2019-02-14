const fs = require('fs');
const stream = require('stream');
const { promisify } = require('util');
const BactchEmitter = require('./src/indexing/BatchEmitter');
const CSVLineToJSON = require('./src/indexing/CSVLineToJSON');
const NewLineSplitter = require('./src/indexing/NewLineSplitter');
const CreditsTransformer = require('./src/indexing/CreditsTransformer');
const MoviesTransformer = require('./src/indexing/MoviesTransformer');
const ElasticSink = require('./src/indexing/ElasticSink');

const pipeline = promisify(stream.pipeline);


function pushToElastic(fileName, Transformer) {
  return pipeline(
    fs.createReadStream(fileName, { highWaterMark: 1 }),
    new NewLineSplitter(),
    new CSVLineToJSON(),
    new Transformer(),
    new BactchEmitter(),
    new ElasticSink(),
  );
}

setImmediate(async () => {
  await Promise.all([
    // pushToElastic('smaller_credits.csv', CreditsTransformer),
    pushToElastic('tmdb_5000_credits.csv', CreditsTransformer),
    pushToElastic('tmdb_5000_movies.csv', MoviesTransformer),
  ]);
});
