const hapi = require('hapi');
const authorizationPlugin = require('..');

describe('Authorization ', () => {
  let server;
  beforeEach(async () => {
    server = new hapi.Server();
    await server.register({
      plugin: authorizationPlugin,
    });

    server.route({
      path: '/with-auth',
      method: 'GET',
      handler: () => {
        return { status: 'OK' };
      },
      options: {
        auth: 'simple',
      },
    });

    server.route({
      path: '/no-auth',
      method: 'GET',
      handler: () => {
        return { status: 'OK' };
      },
      options: {},
    });
  });

  afterEach(async () => {
    await server.stop();
  });

  test('Unauthorized access', async () => {
    const response = await server.inject({
      url: '/with-auth',
      method: 'GET',
    });

    expect(response.statusCode).toBe(401);
  });

  test('Authorized access', async () => {
    const response = await server.inject({
      url: '/with-auth',
      method: 'GET',
      headers: {
        Authorization: 'Basic YWRtaW46cGFzc3dvcmQ=',
      },
    });

    expect(response.statusCode).toBe(200);
  });

  test('No authorization access', async () => {
    const response = await server.inject({
      url: '/no-auth',
      method: 'GET',
    });

    expect(response.statusCode).toBe(200);
  });
});
