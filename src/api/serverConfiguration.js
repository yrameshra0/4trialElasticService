const hapi = require('hapi');
const { inspect } = require('util');

async function init() {
  const server = hapi.server({});

  server.route({
    method: 'GET',
    path: '/movies/user/{userId}/search',
    handler: (request, headers) => {
      console.log(`REQUEST -- ${inspect(request, false, Number.MAX_SAFE_INTEGER)}`);
      console.log(`HEADERS -- ${inspect(headers, false, Number.MAX_SAFE_INTEGER)}`);
      console.log('Request Handled');
      return 'Hello World !!';
    },
  });

  await server.start();
  console.log('Server started');
}

process.on('unhandledRejection', (err) => {
  console.log(err);
  process.exit(1);
});

init();
