const Hapi = require('hapi');
const logger = require('./logger');
const loggerPlugin = require('./plugins/logger');
const routePlugin = require('./plugins/route_register');
const goodPlugin = require('./plugins/good-console');
const authPlugin = require('./plugins/authorization');

const server = new Hapi.Server({ host: 'localhost', port: 3000 });

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

async function init() {
  await server.register([loggerPlugin, routePlugin, goodPlugin, authPlugin]);

  logger.info('Server Initialized');
  await server.initialize();
  return server;
}

module.exports = {
  init,
  start,
  stop,
};
