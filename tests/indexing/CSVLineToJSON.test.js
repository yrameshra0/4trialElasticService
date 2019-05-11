const stream = require('stream');
const util = require('util');

const { Readable } = stream;
const pipeline = util.promisify(stream.pipeline);
const CSVLineToJSONObject = require('../../src/indexing/CSVLineToJSON');
const StreamSink = require('./utils/StreamSink');

class SourceStream extends Readable {
  constructor() {
    super({ objectMode: true });
  }

  _read() {
    this.push('movie_id,title,cast');
    this.push('19995,Avatar,"[{""cast_id"": 242, ""character"": ""Jake Sully""}]"');
    this.push(null);
  }
}

test('verify CSVLineToJSONObject', async () => {
  const sink = new StreamSink();
  await pipeline(new SourceStream(), new CSVLineToJSONObject(), sink);

  const { expectedChunks, frequency } = sink.getStreamStatus();
  expect(frequency).toBe(1);
  expect(expectedChunks).toEqual([
    {
      movie_id: 19995,
      title: 'Avatar',
      cast: [
        {
          cast_id: 242,
          character: 'Jake Sully',
        },
      ],
    },
  ]);
});
