const client = require('../../src/elastic');

const elastic = require('../../src/elastic/_client');

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
});
