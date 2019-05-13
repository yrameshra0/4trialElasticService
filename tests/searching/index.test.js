const search = require('../../src/searching');
const elastic = require('../../src/elastic');

jest.mock('../../src/elastic');

describe('Searching', () => {
  test('Incorrect user id requested', async () => {
    const userId = 'incorrect user';
    const searchTerm = 'not important';
    await expect(search(userId, searchTerm)).rejects.toThrow('Not found');
  });

  test('Search forwared to elastic', async () => {
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
});
