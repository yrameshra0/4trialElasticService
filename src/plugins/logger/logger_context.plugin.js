const { getContext, setRequest, setServer } = require('./logger_context');

function register(server, options) {
  if (!getContext().active) throw new Error('Current context is not active');

  setServer(server);
  // OnRequest is entry-point further reading @ https://hapijs.com/api#request-lifecycle
  server.ext('onRequest', (request, h) => {
    console.log(`ON REQUEST I'M INN`);
    setRequest(request);
    return h.continue;
  });
}

// module.exports.loggerConext = loggerConext;
module.exports.plugin = {
  name: 'logger-context',
  version: '1.0.0',
  register,
};
