const { Writable } = require('stream');

class StreamSink extends Writable {
  constructor() {
    const objectMode = true;
    const highWaterMark = 1;
    super({ objectMode, highWaterMark });
    this.expectedChunks = [];
    this.frequency = 0;
  }

  _write(chunk, encoding, callback) {
    this.expectedChunks.push(chunk);
    this.frequency += 1;
    callback();
  }

  getStreamStatus() {
    return { expectedChunks: this.expectedChunks, frequency: this.frequency };
  }
}

module.exports = StreamSink;
