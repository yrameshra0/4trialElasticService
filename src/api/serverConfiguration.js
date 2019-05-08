const Hapi = require('hapi');
const logger = require('../plugins/logger/logger');
const loggerPlugin = require('../plugins/logger');
const routePlugin = require('../plugins/route_register');
const goodPlugin = require('../plugins/good-console');

const server = new Hapi.Server({ host: 'localhost', port: 3000 });

async function init() {
  await server.register([loggerPlugin, routePlugin, goodPlugin]);

  server.route({
    method: 'GET',
    path: '/movies/user/{userId}/search',
    options: {
      log: {
        collect: true,
      },
    },
    handler: (request, handler) => {
      logger.info('Handling the request');
      logger.info('Handled the request');
      return 'Hello World !!';
    },
  });

  logger.info('Server Initialized');
  await server.initialize();
  return server;
}

async function start() {
  await server.start();
  logger.info('Server Started');
  return server;
}

async function stop() {
  await server.stop();
  logger.info('Server Stopped');
  return server;
}

process.on('unhandledRejection', err => {
  logger.error(err);
});

// server.events.on({ name: 'request', channels: 'app' }, (request, event, tags) => {
//   printMessage(event);
// });

// server.events.on({ name: 'request', channels: 'internal' }, (request, event, tags) => {
//   printMessage(event);
// });

// server.events.on('log', (event, tags) => {
//   printMessage(event);
// });
module.exports = {
  init,
  start,
  stop,
};
