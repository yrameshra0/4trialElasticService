const Bcrypt = require('bcryptjs');
const basicAuth = require('@hapi/basic');
const { users } = require('../../config');

const validate = async (request, username, password, h) => {
  const user = users[username];
  if (!user) {
    return { credentials: null, isValid: false };
  }

  const isValid = await Bcrypt.compare(password, user.password);
  const credentials = { id: user.id, name: user.name };

  return { isValid, credentials };
};

async function register(server, options) {
  await server.register(basicAuth);
  server.auth.strategy('simple', 'basic', { validate });
}

module.exports.plugin = {
  name: 'Authorization',
  version: '1.0.0',
  register,
};
