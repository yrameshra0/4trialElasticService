const hapi = require('hapi');
const cls = require('continuation-local-storage');
const loggerContextPlugin = require('../logger_context.plugin');

describe('logger context hooking', () => {
  test('understanding context setting', async () => {
    const server = new hapi.Server();
    await server.register({
      plugin: loggerContextPlugin,
    });
    await server.initialize();
    server.ext('onPreStart', () => {
      console.log(JSON.stringify(cls.getNamespace('logger-context').get('server')));
    });
  });
});
