const stream = require('stream');
const util = require('util');

const { Readable } = stream;
const pipeline = util.promisify(stream.pipeline);
const elasticActions = require('../../src/elastic/actions');
const ElasticSink = require('../../src/indexing/ElasticSink');

jest.mock('../../src/elastic/actions');

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
  elasticActions.bulkUpload.mockReturnValueOnce(Promise.resolve());

  await pipeline(new SourceStream(), new ElasticSink());

  expect(elasticActions.bulkUpload).toHaveBeenCalledTimes(2);
});
test('verify ElasticSink when un-successful', async () => {
  elasticActions.bulkUpload.mockReturnValueOnce(Promise.reject(new Error('Faking elastic error')));
  try {
    await pipeline(new SourceStream(), new ElasticSink());
  } catch (error) {
    expect(error.message).toBe('Faking elastic error');
  }
});
