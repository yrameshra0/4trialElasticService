const userPreferences = require('./user_preferences');
const elastic = require('../elastic');

let preferenceSearchResults;

function findUserById(userId) {
  const userIdMatch = item => !!item[userId];

  const user = userPreferences.find(userIdMatch);
  if (!user) throw new Error('Not found');

  return user[userId];
}

async function search(userId, searchTerm) {
  const user = findUserById(userId);
  const movieSearch = {
    searchTerm,
    preferences: {
      langaugages: user.preferred_languages,
      actors: user.favourite_actors,
      directors: user.favourite_directors,
    },
  };

  return elastic.search(movieSearch);
}

const userPreferencesQueryGenerator = () => {
  const allPreferencesMatch = userPreferences
    .map(userInfo => userInfo[Object.keys(userInfo)[0]])
    .map(userInfo => [...userInfo.favourite_actors, ...userInfo.favourite_directors])
    .reduce((acc, val) => [...acc, ...val], [])
    .map(val => ({ match: { name: val } }));

  const onlyMovieIdAggregation = {
    aggs: {
      allResluts: {
        top_hits: {
          _source: ['movieId'],
        },
      },
    },
  };

  const allAggregations = userPreferences
    .map(userInfo => {
      const userId = Object.keys(userInfo)[0];
      const inclusion = [...userInfo[userId].favourite_actors, ...userInfo[userId].favourite_directors];
      return {
        [userId]: {
          terms: {
            field: 'name.raw',
            include: inclusion,
          },
          ...onlyMovieIdAggregation,
        },
      };
    })
    .reduce((acc, val) => ({ ...acc, ...val }), {});

  return {
    query: {
      bool: {
        should: allPreferencesMatch,
      },
    },
    size: 0,
    aggs: {
      ...allAggregations,
    },
  };
};

async function allUsersPreferencesSearch() {
  if (preferenceSearchResults) return preferenceSearchResults;

  preferenceSearchResults = await elastic.search(userPreferencesQueryGenerator());

  return preferenceSearchResults;
}

function clearPreferenceSearchResults() {
  preferenceSearchResults = undefined;
}

module.exports = {
  search,
  allUsersPreferencesSearch,
  clearPreferenceSearchResults,
};
