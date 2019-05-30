const logger = require('../logger');
const userPreferences = require('./user_preferences');
const elastic = require('../elastic');

const MAX_MOVIES = 3;

let preferenceSearchResults;

function findUserById(userId) {
  const userIdMatch = item => !!item[userId];

  const user = userPreferences.find(userIdMatch);
  if (!user) throw new Error('Not found');

  return user[userId];
}

function searchTermResponseParser(response) {
  const { hits } = response.hits;
  /* eslint-disable no-underscore-dangle */
  return hits.map(val => val._source.title);
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

  try {
    return searchTermResponseParser(await elastic.searchWithTerm(movieSearch));
  } catch (err) {
    logger.error(err);
    throw err;
  }
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

function originalLanguageQueryGenerator(response) {
  const { aggregations } = response;
  const userAggs = Object.keys(aggregations);

  function movieIdsForUser(userId) {
    const hits = aggregations[userId].buckets.reduce((acc, bucket) => bucket.allResluts.hits.hits, []);
    logger.info('HITTS', hits);
    /* eslint-disable no-underscore-dangle */
    return hits.map(val => val._source.movieId).map(val => `movieId:${val}`);
  }

  function uniqieMovieIds() {
    return userAggs
      .map(movieIdsForUser)
      .reduce((acc, val) => [...acc, ...val], [])
      .reduce((acc, val) => {
        if (!acc.includes(val)) acc.push(val);

        return acc;
      }, []);
  }

  const titleAggs = () => ({
    aggs: {
      top_hits: {
        _source: ['title'],
        size: 10,
      },
    },
  });

  const idsGroups = userId => ({
    aggs: {
      originalLanguageFilter: {
        terms: {
          field: 'originalLanguage',
          include: findUserById(userId)
            .preferred_languages.map(val => val.substring(0, 2))
            .map(val => val.toLowerCase()),
        },
      },
      ...titleAggs(),
    },
  });

  return {
    query: {
      ids: {
        values: uniqieMovieIds(),
      },
    },
    size: 0,
    aggs: userAggs
      .map(userId => ({
        [userId]: {
          terms: {
            field: 'id',
            include: movieIdsForUser(userId),
          },
          ...idsGroups(userId),
        },
      }))
      .reduce((acc, val) => ({ ...acc, ...val }), {}),
  };
}

function userPreferenceParser(response) {
  const { aggregations } = response;
  const userIds = Object.keys(aggregations);

  return userIds.map(user => {
    const movies = aggregations[user].buckets
      /*
       All the movies are sent back by elastic with filter bucket indicating if it indeed
       successfully bypassed the filtering
       */
      .filter(bucketVal => bucketVal.originalLanguageFilter.buckets.length > 0)
      .reduce((acc, val) => {
        const { hits } = val.aggs.hits;
        /* eslint-disable no-underscore-dangle */
        const titles = hits.map(movie => movie._source.title);
        return [...acc, ...titles];
      }, [])
      .splice(0, MAX_MOVIES);
    return {
      user,
      movies,
    };
  });
}

async function allUsersPreferencesSearch() {
  if (preferenceSearchResults) return preferenceSearchResults;

  try {
    const allPreferencesFilter = await elastic.searchWithQuery(userPreferencesQueryGenerator());
    logger.info('allPreferencesFilter results', allPreferencesFilter);
    const filterByOriginalLanguage = await elastic.searchWithQuery(originalLanguageQueryGenerator(allPreferencesFilter));
    preferenceSearchResults = userPreferenceParser(filterByOriginalLanguage);

    return preferenceSearchResults;
  } catch (err) {
    logger.error(err);
    throw err;
  }
}

function clearPreferenceSearchResults() {
  preferenceSearchResults = undefined;
}

module.exports = {
  search,
  allUsersPreferencesSearch,
  clearPreferenceSearchResults,
  findUserById,
};
