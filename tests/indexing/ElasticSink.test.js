const stream = require('stream');
const util = require('util');

const { Readable } = stream;
const pipeline = util.promisify(stream.pipeline);
jest.mock('../../src/elasticClient');
const ElasticSink = require('../../src/indexing/ElasticSink');
const elasticClient = require('../../src/elasticClient');

class SourceStream extends Readable {
  constructor() {
    super({ objectMode: true });
  }

  _read() {
    this.push(1);
    this.push(2);
    this.push(null);
  }
}

test('verify ElasticSink when successful', async () => {
  await pipeline(
    new SourceStream(),
    new ElasticSink(),
  );

  expect(elasticClient.blukUpload).toHaveBeenCalledTimes(2);
});
test('verify ElasticSink when un-successful', async () => {
  elasticClient.blukUpload.mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error('Faking elastic error'))));
  try {
    await pipeline(
      new SourceStream(),
      new ElasticSink(),
    );
  } catch (error) {
    expect(error.message).toBe('Faking elastic error');
  }
});
