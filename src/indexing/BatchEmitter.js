const { Transform } = require('stream');

class BatchEmitter extends Transform {
  constructor(highWaterMark = 1, batchSize = 5) {
    const objectMode = true;
    super({ objectMode, highWaterMark });
    this.buffer = [];
    this.batchSize = batchSize;
  }

  pushBatchForward() {
    this.push(this.buffer);
    this.buffer = [];
  }

  _transform(chunk, encoding, callback) {
    this.buffer.push(chunk);
    if (this.buffer.length >= this.batchSize) {
      this.pushBatchForward();
    }
    callback();
  }

  _flush(callback) {
    this.pushBatchForward();
    callback();
  }
}
module.exports = BatchEmitter;
