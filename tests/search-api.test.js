const serverConfiguration = require('../src/api/serverConfiguration');

describe('searching api contracts', () => {
  let server;

  beforeAll(async () => {
    try {
      server = await serverConfiguration.init();
    } catch (error) {
      throw error;
    }
    if (!server) throw new Error('Error encountered while starting test with server');
  });

  afterAll(async () => {
    await server.stop();
  });

  test('user preferences based single world movie search', async () => {
    const response = await server.inject({
      url: '/movies/user/1/search?text=Sam',
      method: 'GET',
    });
    expect(response.statusCode).toBe(200);
  });
});
