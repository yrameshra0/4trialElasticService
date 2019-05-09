const env = process.env.NODE_ENV;

const properties = {
  local: {
    elasticConfig: {
      host: 'localhost:9200',
      log: 'debug',
    },
  },
  index: 'movies',
};

module.exports = (() => properties[env] || properties.local)();
