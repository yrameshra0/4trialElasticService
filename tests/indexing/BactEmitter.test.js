const stream = require('stream');
const util = require('util');

const { Readable } = stream;
const pipeline = util.promisify(stream.pipeline);
const StreamSink = require('./StreamSink');
const BatchEmitter = require('../../src/indexing/BatchEmitter');

class SourceStream extends Readable {
  constructor() {
    super({ objectMode: true });
  }

  _read() {
    let index = 0;
    while (index < 6) {
      index += 1;
      this.push(index);
    }
    this.push(null);
  }
}

test('verify BatchEmitter', async () => {
  const sink = new StreamSink();
  await pipeline(
    new SourceStream(),
    new BatchEmitter(),
    sink,
  );
  const { expectedChunks, frequency } = sink.getStreamStatus();
  expect(frequency).toBe(2);
  expect(expectedChunks).toEqual([[1, 2, 3, 4, 5], [6]]);
});
