const hapi = require('hapi');
const routesRegister = require('../routes_register.plugin');

describe('routes_register plugin tests', () => {
  test('plugin discovery and registration', async () => {
    const server = new hapi.Server();
    await server.register({
      plugin: routesRegister,
    });

    await server.initialize();
    // NOW ACTUALLY WE ARE TESTING HERE

    const validateRegistration = async ({ url, method }) =>
      expect(
        server.inject({
          url,
          method,
        }),
      ).resolves.toHaveProperty('statusCode', 200);
    const urlWithMethod = (url, method) => ({ url, method });

    // prettier-ignore
    await Promise.all([
      urlWithMethod('/route1','GET'),
      urlWithMethod('/route2', 'POST'),
      urlWithMethod('/route3', 'GET'),
      urlWithMethod('/route4', 'POST'),
    ].map(route => validateRegistration(route)));
  });
});
