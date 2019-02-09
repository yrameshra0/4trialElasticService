const { Writable } = require('stream');
const { blukUpload } = require('../elasticClient');

class ElasticSink extends Writable {
  constructor(highWaterMark = 1) {
    const objectMode = true;
    super({ objectMode, highWaterMark });
  }

  /* eslint-disable class-methods-use-this */
  async _write(chunk, encoding, callback) {
    try {
      await blukUpload({ body: chunk });
      callback();
    } catch (err) {
      callback(err);
    }
  }
}
module.exports = ElasticSink;
