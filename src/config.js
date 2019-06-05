const env = process.env.NODE_ENV;

const properties = {
  local: {
    elasticConfig: {
      host: 'localhost:9200',
      log: 'debug',
    },
    index: 'movies',
    users: {
      admin: {
        username: 'admin',
        password: '$2b$10$bXGXTAdyWrk3vqdeMs4WOuXLDmw.LBk2nu.T3IahpGQjBl5QP8vZa', // 'secret'
        name: 'admin',
      },
    },
  },
  test: {
    elasticConfig: {
      host: 'elastic',
      log: 'debug',
    },
    index: 'movies',
    users: {
      admin: {
        username: 'admin',
        password: '$2b$10$NP365.8aw/yGlGtkLWhOtOjWTdP0P1sjmf8TVUIKp5fa3Q.RhLj2u', // 'secret'
        name: 'admin',
      },
    },
  },
  production: {
    elasticConfig: {
      host: 'elastic',
      log: 'debug',
    },
    index: 'movies',
    users: {
      admin: {
        username: 'admin',
        password: '$2b$10$NP365.8aw/yGlGtkLWhOtOjWTdP0P1sjmf8TVUIKp5fa3Q.RhLj2u', // 'secret'
        name: 'admin',
      },
    },
  },
};

module.exports = (() => properties[env] || properties.local)();
