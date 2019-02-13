jest.mock('elasticsearch');
const { Client } = require('elasticsearch');

const mockBulkApi = jest.fn().mockImplementation(() => Promise.resolve());
Client.mockImplementation(() => ({
  bulk: mockBulkApi,
}));
const { bulkUpload } = require('../src/elasticClient');

afterAll(() => {
  Client.mockClear();
});

test('Successful upload data to elastic', async () => {
  const data = {
    type: 'somemovie',
    id: 'someid',
  };
  await bulkUpload([data]);
  expect(mockBulkApi).toHaveBeenCalledTimes(1);
});
