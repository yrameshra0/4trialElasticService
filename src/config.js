const env = process.env.NODE_ENV;

const properties = {
  local: {
    elasticConfig: {
      host: 'localhost:9210',
      log: 'trace',
    },
  },
};

module.exports = (() => properties[env] || properties.local)();
