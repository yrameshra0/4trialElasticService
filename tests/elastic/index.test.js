const client = require('../../src/elastic');
const elastic = require('../../src/elastic/_client');
const sampleSearchBody = require('./sample_search_body');
const indexMapping = require('./__snapshots__/indexMapping');

const data = {
  type: 'somemovie',
  id: 'someid',
};

describe('Elastic client and actions', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('Failure with bulk upload', async () => {
    const blukSpy = jest.spyOn(elastic, 'bulk').mockRejectedValue(new Error('Error condition'));

    await expect(client.bulkUpload([data])).rejects.toThrowError('Error condition');
    expect(blukSpy).toHaveBeenCalledTimes(3);
  });

  test('Successful upload data to elastic', async () => {
    const blukSpy = jest.spyOn(elastic, 'bulk').mockResolvedValue();

    await client.bulkUpload([data]);
    expect(blukSpy).toHaveBeenCalledTimes(1);
  });

  test('Successful searching', async () => {
    const searchSpy = jest.spyOn(elastic, 'search').mockResolvedValue();

    const preferences = {
      actors: ['Denzel Washington', 'Anne Hathaway', 'Tom Hanks'],
      directors: ['Guy Ritchie', 'Quentin Tarantino'],
      langaugages: ['English'],
    };

    await client.search({ searchTerm: 'Sam', preferences });

    expect(searchSpy).toHaveBeenCalledTimes(1);
    expect(searchSpy).toBeCalledWith(sampleSearchBody);
  });

  test('Successful reseting index', async () => {
    const index = 'movies';
    const indiciesExitsSpy = jest.spyOn(elastic.indices, 'exists').mockResolvedValue(true);
    const indiciesDeleteSpy = jest.spyOn(elastic.indices, 'delete').mockResolvedValue();
    const indiciesCreateSpy = jest.spyOn(elastic.indices, 'create').mockResolvedValue();

    await client.resetIndex();

    expect(indiciesCreateSpy).toHaveBeenCalledTimes(1);
    expect(indiciesExitsSpy).toHaveBeenCalledTimes(1);
    expect(indiciesDeleteSpy).toHaveBeenCalledTimes(1);
    expect(indiciesExitsSpy).toBeCalledWith({ index });
    expect(indiciesDeleteSpy).toBeCalledWith({ index });
    expect(indiciesCreateSpy).toBeCalledWith(indexMapping);
  });
});
