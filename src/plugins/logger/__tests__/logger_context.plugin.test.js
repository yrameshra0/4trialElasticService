const hapi = require('hapi');
const { getServer, getRequest } = require('../logger_context');
const loggerContextPlugin = require('..');

describe('logger context hooking', () => {
  test('server registered to context', async () => {
    const server = new hapi.Server();
    await server.register({
      plugin: loggerContextPlugin,
    });

    expect(getServer).toBeDefined();
  });

  test('request registered with context', async () => {
    const server = new hapi.Server();

    await server.register({
      plugin: loggerContextPlugin,
    });

    server.route({
      path: '/request-logging-test',
      method: 'GET',
      handler: (r, h) => {
        expect(getRequest()).toBeDefined();
        return 'Route For Test';
      },
    });

    await server.initialize();

    const response = await server.inject({
      method: 'GET',
      url: '/request-logging-test',
    });

    expect(response.statusCode).toBe(200);
  });
});
