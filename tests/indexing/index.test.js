const fs = require('fs');
const { Readable } = require('stream');
const indexing = require('../../src/indexing');
const elasticActions = require('../../src/elastic/actions');

jest.mock('fs');
jest.mock('../../src/elastic/actions');

class MockStream extends Readable {
  constructor() {
    super({ objectMode: true });
  }

  _read() {
    this.push(null);
  }
}

describe('indexing csvs', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('resets index and uploads smaller csv', async () => {
    fs.createReadStream.mockReturnValue(new MockStream());

    await indexing.updloadToElastic();

    expect(elasticActions.resetIndex).toBeCalled();
    expect(fs.createReadStream).toBeCalledTimes(2);
    expect(fs.createReadStream).toBeCalledWith('./csvs/smaller_credits.csv', { highWaterMark: 1 });
    expect(fs.createReadStream).toBeCalledWith('./csvs/smaller_movies.csv', { highWaterMark: 1 });
  });

  test('resets index and uploads original csv', async () => {
    fs.createReadStream.mockReturnValue(new MockStream());

    await indexing.updloadToElastic(true);

    expect(elasticActions.resetIndex).toBeCalled();
    expect(fs.createReadStream).toBeCalledTimes(2);
    expect(fs.createReadStream).toBeCalledWith('./csvs/tmdb_5000_credits.csv', { highWaterMark: 1 });
    expect(fs.createReadStream).toBeCalledWith('./csvs/tmdb_5000_movies.csv', { highWaterMark: 1 });
  });
});
