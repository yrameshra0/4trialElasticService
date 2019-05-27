const fs = require('fs');
const stream = require('stream');
const { promisify } = require('util');
const BactchEmitter = require('./BatchEmitter');
const CSVLineToJSON = require('./CSVLineToJSON');
const NewLineSplitter = require('./NewLineSplitter');
const CreditsTransformer = require('./CreditsTransformer');
const MoviesTransformer = require('./MoviesTransformer');
const ElasticSink = require('./ElasticSink');
const elasticClient = require('../elastic/');

const pipeline = promisify(stream.pipeline);

function pushToElastic(fileName, Transformer) {
  /* prettier-ignore */
  return pipeline(
            fs.createReadStream(fileName, { highWaterMark: 1 }), 
            new NewLineSplitter(), 
            new CSVLineToJSON(),
            new Transformer(), 
            new BactchEmitter(), 
            new ElasticSink()
        );
}

async function uploadToElastic(full = false) {
  const filePrefix = `${__dirname}/csvs/${full ? 'tmdb_5000' : 'smaller'}`;
  await elasticClient.resetIndex();
  /* prettier-ignore */
  await Promise.all([
      pushToElastic(`${filePrefix}_credits.csv`, CreditsTransformer),
      pushToElastic(`${filePrefix}_movies.csv`, MoviesTransformer)
    ]);
}

module.exports = {
  uploadToElastic,
};
