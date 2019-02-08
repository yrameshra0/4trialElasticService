const stream = require('stream');
const util = require('util');

const { Readable } = stream;
const pipeline = util.promisify(stream.pipeline);
const CreditsTransformer = require('../../../src/indexing/CreditsTransformer');
const StreamSink = require('./StreamSink');

class SourceStream extends Readable {
  constructor() {
    super({ objectMode: true });
  }

  _read() {
    this.push({
      movie_id: '19995',
      title: 'Avatar',
      cast: [
        {
          cast_id: '242',
          character: 'Jake Sully',
          name: 'Sam Worthington',
          gender: 'male',
        },
      ],
    });
    this.push(null);
  }
}

test('verify CreditsTransformer', async () => {
  const sink = new StreamSink();
  await pipeline(
    new SourceStream(),
    new CreditsTransformer(),
    sink,
  );
  const { expectedChunks, frequency } = sink.getStreamStatus();
  expect(frequency).toBe(1);
  expect(expectedChunks).toEqual([
    {
      castId: '242',
      character: 'Jake Sully',
      gender: 'male',
      id: 'movieId:19995::castId:242',
      movieId: '19995',
      name: 'Sam Worthington',
      title: 'Avatar',
      type: 'cast',
    },
  ]);
});