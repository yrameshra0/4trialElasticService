const stream = require('stream');
const util = require('util');

const { Readable } = stream;
const pipeline = util.promisify(stream.pipeline);
const NewLineSplitter = require('../../src/indexing/NewLineSplitter');
const StreamSink = require('./utils/StreamSink');

class SourceStream extends Readable {
  constructor() {
    super({ objectMode: true });
  }

  _read() {
    this.push('This paragraph\nsplitted by\nnewlines.');
    this.push(null);
  }
}

test('verify NewLineSplitter', async () => {
  const sink = new StreamSink();
  await pipeline(new SourceStream(), new NewLineSplitter(), sink);

  const { expectedChunks, frequency } = sink.getStreamStatus();
  expect(frequency).toBe(3);
  expect(expectedChunks).toEqual(['This paragraph', 'splitted by', 'newlines.']);
});
