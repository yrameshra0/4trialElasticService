const { allUsersPreferencesSearch } = require('../searching');

module.exports = {
  path: '/movies/users',
  method: 'GET',
  handler: () => {
    return allUsersPreferencesSearch();
  },
  options: {},
};
