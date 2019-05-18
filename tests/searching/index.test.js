const { search, allUsersPreferencesSearch } = require('../../src/searching');
const elastic = require('../../src/elastic');

jest.mock('../../src/elastic');

describe('Searching', () => {
  test('Incorrect user id requested', async () => {
    const userId = 'incorrect user';
    const searchTerm = 'not important';
    await expect(search(userId, searchTerm)).rejects.toThrow('Not found');
  });

  test('user specified search term', async () => {
    const userId = '101';
    const searchTerm = 'Tom Hanks';
    const preferences = {
      actors: ['Denzel Washington', 'Anne Hathaway', 'Tom Hanks'],
      directors: ['Guy Ritchie', 'Quentin Tarantino'],
      langaugages: ['English'],
    };

    await search(userId, searchTerm);

    expect(elastic.search).toBeCalledWith({ searchTerm, preferences });
  });

  test('all users preferences search', async () => {});
  test('all users preferences cached', async () => {
    const mockedResults = { some: 'results' };
    elastic.search.mockReturnValue(mockedResults);

    await expect(allUsersPreferencesSearch()).resolves.toMatchObject(mockedResults);
    await expect(allUsersPreferencesSearch()).resolves.toMatchObject(mockedResults);

    expect(elastic.search).toBeCalledTimes(1);
  });
});
