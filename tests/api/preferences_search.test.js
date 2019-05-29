const hapi = require('hapi');
const preferencesSearchApi = require('../../src/api/preferences_search');
const searching = require('../../src/searching');

jest.mock('../../src/searching');
describe('Preferences Search Api', () => {
  let server;

  beforeAll(() => {
    server = new hapi.Server();
    server.route(preferencesSearchApi);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await server.stop();
  });

  test('handles preferences search', async () => {
    searching.allUsersPreferencesSearch.mockReturnValueOnce([]);

    const response = await server.inject({
      url: '/movies/users',
      method: 'GET',
    });

    expect(response.statusCode).toBe(200);
    expect(searching.allUsersPreferencesSearch).toBeCalled();
  });
});
