const cls = require('continuation-local-storage');
const loggerConext = 'logger-context';
const namespace = cls.createNamespace(loggerConext);

function register(server, options) {
  namespace.bind(server);
  namespace.set('server', server);
}

// module.exports.loggerConext = loggerConext;
module.exports.plugin = {
  name: 'logger-context',
  version: '1.0.0',
  register,
};
