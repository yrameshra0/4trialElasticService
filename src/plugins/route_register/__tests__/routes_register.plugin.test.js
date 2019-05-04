const hapi = require('hapi');
const routesRegister = require('../routes_register.plugin');

describe('routes_register plugin tests', () => {
  const validateRegistration = async (server, { url, method }, statusCode = 200) =>
    expect(
      server.inject({
        url,
        method,
      }),
    ).resolves.toHaveProperty('statusCode', statusCode);

  const urlWithMethod = (url, method) => ({ url, method });

  test('plugin discovery and registration', async () => {
    const server = new hapi.Server();
    await server.register({
      plugin: routesRegister,
    });

    await server.initialize();
    // NOW ACTUALLY WE ARE TESTING HERE

    // prettier-ignore
    await Promise.all([
      urlWithMethod('/route1','GET'),
      urlWithMethod('/route2', 'POST'),
      urlWithMethod('/route3', 'GET'),
      urlWithMethod('/route4', 'POST'),
    ].map(route => validateRegistration(server, route)));
  });

  test('plugin discovery and registration under no test mode', async () => {
    process.env.NODE_ENV = 'not-test';

    const server = new hapi.Server();
    await server.register({
      plugin: routesRegister,
    });

    await server.initialize();
    // NOW ACTUALLY WE ARE TESTING HERE

    // prettier-ignore
    await Promise.all([
      urlWithMethod('/route1', 'GET'),
    ].map(route => validateRegistration(server, route, 404)));
  });
});
