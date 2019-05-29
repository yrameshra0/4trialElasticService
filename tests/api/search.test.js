const hapi = require('hapi');
const searchApi = require('../../src/api/search');
const searching = require('../../src/searching');

jest.mock('../../src/searching');
describe('Search Api', () => {
  let server;

  beforeAll(() => {
    server = new hapi.Server();
    server.route(searchApi);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await server.stop();
  });

  test('user id validations - Not in Range', async () => {
    searching.findUserById.mockImplementation(() => {
      throw new Error('User not found');
    });

    const responses = await Promise.all([
      server.inject({
        url: '/movies/user/10/search?text=1223',
        method: 'GET',
      }),
      server.inject({
        url: '/movies/user/107/search?text=1223',
        method: 'GET',
      }),
    ]);

    responses.forEach(response => {
      expect(response.statusMessage).toBe('Bad Request');
      expect(response.statusCode).toBe(400);
    });
  });

  test('search text not provided', async () => {
    searching.findUserById.mockReturnValueOnce({});

    const response = await server.inject({
      url: '/movies/user/101/search?',
      method: 'GET',
    });

    expect(response.statusMessage).toBe('Bad Request');
    expect(response.statusCode).toBe(400);
  });

  test('handles search', async () => {
    searching.search.mockReturnValueOnce([]);
    searching.findUserById.mockReturnValueOnce({});

    const response = await server.inject({
      url: '/movies/user/101/search?text=searchMe',
      method: 'GET',
    });

    expect(response.statusCode).toBe(200);
    expect(searching.search).toBeCalledWith(101, 'searchMe');
  });
});
