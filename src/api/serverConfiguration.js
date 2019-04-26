const Hapi = require('hapi');
const { inspect } = require('util');

const server = new Hapi.server({});
const printMessage = message => console.log(inspect(message, false, Number.MAX_SAFE_INTEGER));

async function init() {
  server.route({
    method: 'GET',
    path: '/movies/user/{userId}/search',
    handler: (request, headers) => {
      printMessage(request);
      printMessage(headers);
      printMessage('Request Handled');
      return 'Hello World !!';
    },
  });

  await server.initialize();
  printMessage({ 'Server Initialize': server.info });
  return server;
}

async function start() {
  await server.start();
  printMessage({ 'Server Started': server.info });
  return server;
}

process.on('unhandledRejection', err => {
  printMessage(err);
  process.exit(1);
});

module.exports = {
  init,
  start,
};
