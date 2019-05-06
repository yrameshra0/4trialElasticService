const hapi = require('hapi');
const { getContext, getServer, getRequest } = require('../logger_context');
const loggerContextPlugin = require('../logger_context.plugin');

describe('logger context hooking', () => {
  test('server registration fails when context is not active', async () => {
    const server = new hapi.Server();
    await expect(
      server.register({
        plugin: loggerContextPlugin,
      }),
    ).rejects.toThrow('Current context is not active');
  });

  test('server registered with context', async () => {
    const server = new hapi.Server();
    await getContext().runAndReturn(async () => {
      await server.register({
        plugin: loggerContextPlugin,
      });

      expect(getServer()).toBeDefined();
    });
  });

  test('request registered with context', async () => {
    const server = new hapi.Server();
    await getContext().runAndReturn(async () => {
      await server.register({
        plugin: loggerContextPlugin,
      });

      server.route({
        path: '/request-logging-test',
        method: 'GET',
        handler: (r, h) => {
          console.log('BRO WHATS THE PROBLEM');
          console.log(JSON.stringify(getContext()));
          expect(getRequest()).toBeDefined();
          return 'Route For Test';
        },
      });

      await server.initialize();
    });

    const response = await server.inject({
      method: 'GET',
      url: '/request-logging-test',
    });

    expect(response.statusCode).toBe(200);
  });
});
