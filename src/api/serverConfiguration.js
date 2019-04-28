const Hapi = require('hapi');
const { inspect } = require('util');

const server = new Hapi.Server({ host: 'localhost', port: 3000 });

async function init() {
  server.route({
    method: 'GET',
    path: '/movies/user/{userId}/search',
    options: {
      log: {
        collect: true,
      },
    },
    handler: (request, handler) => {
      request.log('info', 'Handling the request');
      request.log('info', 'Handled the request');
      return 'Hello World !!';
    },
  });

  server.log('info', 'Server Initialized');
  await server.initialize();
  return server;
}

async function start() {
  server.log('info', 'Server Started');
  await server.start();
  return server;
}

async function stop() {
  await server.stop();
  server.log('info', 'Server Stopped');
  return server;
}

process.on('unhandledRejection', err => {
  process.exit(1);
});

const printMessage = event => console.log(inspect(event, false, Number.MAX_SAFE_INTEGER));

server.events.on({ name: 'request', channels: 'app' }, (request, event, tags) => {
  printMessage(event);
});

server.events.on({ name: 'request', channels: 'internal' }, (request, event, tags) => {
  printMessage(event);
});

server.events.on('log', (event, tags) => {
  printMessage(event);
});
module.exports = {
  init,
  start,
  stop,
};
