const userPreferences = require('./user_preferences');
const elastic = require('../elastic');

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
module.exports = search;
