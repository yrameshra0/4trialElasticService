const stream = require('stream');
const util = require('util');

const { Readable } = stream;
const pipeline = util.promisify(stream.pipeline);
jest.mock('../../src/elasticClient.js');
const elasticClient = require('../../src/elasticClient');
const ElasticSink = require('../../src/indexing/ElasticSink');

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
  elasticClient.bulkUpload.mockReturnValueOnce(Promise.resolve());

  await pipeline(
    new SourceStream(),
    new ElasticSink(),
  );

  expect(elasticClient.bulkUpload).toHaveBeenCalledTimes(2);
});
test('verify ElasticSink when un-successful', async () => {
  elasticClient.bulkUpload.mockReturnValueOnce(Promise.reject(new Error('Faking elastic error')));
  try {
    await pipeline(
      new SourceStream(),
      new ElasticSink(),
    );
  } catch (error) {
    expect(error.message).toBe('Faking elastic error');
  }
});
