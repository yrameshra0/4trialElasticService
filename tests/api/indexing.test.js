const hapi = require('hapi');
const indexingApi = require('../../src/api/indexing');
const indexing = require('../../src/indexing');

jest.mock('../../src/indexing');
describe('Indexing Api', () => {
  let server;

  beforeAll(() => {
    server = new hapi.Server();
    server.route(indexingApi);
  });

  afterEach(() => {});

  afterAll(async () => {
    await server.stop();
  });

  test('handles indexing', async () => {
    indexing.uploadToElastic.mockResolvedValue();
    const response = await server.inject({
      url: '/index',
      method: 'GET',
    });

    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.payload)).toMatchObject({ uploadToElastic: 'OK' });
    expect(indexing.uploadToElastic).toBeCalled();
  });
});
