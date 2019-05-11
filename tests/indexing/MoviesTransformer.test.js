const stream = require('stream');
const util = require('util');

const { Readable } = stream;
const pipeline = util.promisify(stream.pipeline);
const MoviesTransformer = require('../../src/indexing/MoviesTransformer');
const StreamSink = require('./utils/StreamSink');

class SourceStream extends Readable {
  constructor() {
    super({ objectMode: true });
  }

  _read() {
    this.push({
      id: '19995',
      title: 'Avatar',
      original_language: 'english',
    });
    this.push(null);
  }
}

test('verify CreditsTransformer', async () => {
  const sink = new StreamSink();
  await pipeline(new SourceStream(), new MoviesTransformer(), sink);
  const { expectedChunks, frequency } = sink.getStreamStatus();
  expect(frequency).toBe(1);
  expect(expectedChunks).toEqual([
    {
      id: 'movieId:19995',
      originalLanguage: 'english',
      name: 'Avatar',
      type: 'movie',
    },
  ]);
});
