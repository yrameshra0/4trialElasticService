const client = require('../../src/elastic');
const actions = require('../../src/elastic/actions');

const data = {
  type: 'somemovie',
  id: 'someid',
};

describe('Elastic client negative tests', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('Failure with bulk upload', async () => {
    const blukSpy = jest.spyOn(client, 'bulk').mockRejectedValue(new Error('Error condition'));

    await expect(actions.bulkUpload([data])).rejects.toThrowError('Error condition');
    expect(blukSpy).toHaveBeenCalledTimes(3);
  });

  test('Successful upload data to elastic', async () => {
    const blukSpy = jest.spyOn(client, 'bulk').mockResolvedValue();

    await actions.bulkUpload([data]);
    expect(blukSpy).toHaveBeenCalledTimes(1);
  });
});
