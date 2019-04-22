const hapi = require('hapi');

describe('searching api contracts', () => {
  let server;

  beforeAll(async () => {
    try {
      server = await hapi.server();
      /**
       * Default the server starts on a ephemeral port
       * https://hapijs.com/api#-serveroptionsport
       */
      server.initialize();
    } catch (error) {
      throw error;
    }
    if (!server) throw new Error('Error encountered while starting test with server');
  });

  afterAll(async () => {
    await server.stop();
  });

  test('sample test', async () => {
    expect(true).toBe(true);
  });
});
