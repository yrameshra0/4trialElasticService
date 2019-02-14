/* eslint-disable global-require */

describe('Elastic client negative tests', () => {
  jest.mock('elasticsearch');
  const { Client } = require('elasticsearch');
  const mockBulkApi = jest.fn().mockImplementation(() => Promise.reject(new Error('Error condition')));
  Client.mockImplementation(() => ({
    bulk: mockBulkApi,
  }));
  const { bulkUpload } = require('../src/elasticClient');

  test('Non-Successful upload data to elastic', async () => {
    const data = {
      type: 'somemovie',
      id: 'someid',
    };

    try {
      await bulkUpload([data]);
    } catch (err) {
      expect(err.message).toBe('Error condition');
    }

    expect(mockBulkApi).toHaveBeenCalledTimes(3);
  }, 7000);
});
