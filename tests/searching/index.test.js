const { search, allUsersPreferencesSearch, clearPreferenceSearchResults } = require('../../src/searching');
const elastic = require('../../src/elastic');
const elasticUserPreferencesResponse = require('./__snapshots__/elasticUserPreferencesResponse');
const userPreferencesActorsDirectorsQuery = require('./__snapshots__/userPreferencesActorsDirectorsQuery');
const originalLanguageQuery = require('./__snapshots__/originalLanguageQuery');
const elasticOriginalLanguageResponse = require('./__snapshots__/elasticOriginalLanguageResponse');
const userPreferencesResponse = require('./__snapshots__/userPreferedMovies');
const elasticSearchTermsResponse = require('./__snapshots__/elasticSearchTermsResponse');

jest.mock('../../src/elastic');

describe('Searching', () => {
  afterEach(() => {
    jest.clearAllMocks();
    clearPreferenceSearchResults();
  });

  test('Incorrect user id requested', async () => {
    const userId = 'incorrect user';
    const searchTerm = 'not important';
    await expect(search(userId, searchTerm)).rejects.toThrow('Not found');
  });

  test('user specified search term', async () => {
    elastic.search.mockReturnValueOnce(Promise.resolve(elasticSearchTermsResponse));

    const userId = '101';
    const searchTerm = 'Tom Hanks';
    const preferences = {
      actors: ['Denzel Washington', 'Anne Hathaway', 'Tom Hanks'],
      directors: ['Guy Ritchie', 'Quentin Tarantino'],
      langaugages: ['English'],
    };

    await expect(search(userId, searchTerm)).resolves.toMatchObject(['Avatar', 'Bvatar', 'Zvatar']);

    expect(elastic.search.mock.calls.length).toBe(1);
    expect(elastic.search.mock.calls[0][0]).toMatchObject({ searchTerm, preferences });
  });

  test('search term error case', async () => {
    const elasticError = new Error('Search Failed');
    elastic.search.mockReturnValueOnce(Promise.reject(elasticError));

    await expect(search('101', 'Tom Hanks')).rejects.toThrowError(elasticError);
  });

  test('all users preferences search', async () => {
    /* prettier-ignore */
    elastic.search
    .mockReturnValueOnce(Promise.resolve(elasticUserPreferencesResponse))
    .mockReturnValueOnce(Promise.resolve(elasticOriginalLanguageResponse));

    const results = await allUsersPreferencesSearch();

    expect(elastic.search.mock.calls.length).toBe(2);
    expect(elastic.search.mock.calls[0][0]).toMatchObject(userPreferencesActorsDirectorsQuery);
    expect(elastic.search.mock.calls[1][0]).toMatchObject(originalLanguageQuery);
    expect(results).toMatchObject(userPreferencesResponse);
  });

  test('all users preferences cached', async () => {
    /* prettier-ignore */
    elastic.search
      .mockReturnValueOnce(Promise.resolve(elasticUserPreferencesResponse))
      .mockReturnValueOnce(Promise.resolve(elasticOriginalLanguageResponse));

    await expect(allUsersPreferencesSearch()).resolves.toMatchObject(userPreferencesResponse);
    await expect(allUsersPreferencesSearch()).resolves.toMatchObject(userPreferencesResponse);

    expect(elastic.search).toBeCalledTimes(2);
  });

  test('all users preferences fails with error', async () => {
    const elasticError = new Error('Search Failed');
    elastic.search.mockReturnValueOnce(Promise.reject(elasticError));

    await expect(allUsersPreferencesSearch()).rejects.toThrowError(elasticError);
  });
});
