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
  logger.info('Server Initialized STARTED');
  // try {
  await server.register([authPlugin, goodPlugin, loggerPlugin, routePlugin]);
  // } catch (err) {
  // logger.error(err);
  // }

  logger.info('Server Initialized FINISHED');
  await server.initialize();
  return server;
}

async function initAndStart() {
  await init();
  await start();
}

module.exports = {
  init,
  start,
  stop,
  initAndStart,
};
