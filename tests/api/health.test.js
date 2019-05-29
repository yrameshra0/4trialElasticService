const hapi = require('hapi');
const healthApi = require('../../src/api/health');

describe('Health Api', () => {
  let server;

  beforeAll(() => {
    server = new hapi.Server();
    server.route(healthApi);
  });

  afterEach(() => {});

  afterAll(async () => {
    await server.stop();
  });

  test('handles health check', async () => {
    const response = await server.inject({
      url: '/health',
      method: 'GET',
    });

    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.payload)).toMatchObject({ status: 'OK' });
  });
});
