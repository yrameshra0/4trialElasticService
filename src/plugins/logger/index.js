const { getContext, setRequest, setServer } = require('./logger_context');

function wrapHandler(handler) {
  return (request, helper) => {
    return getContext().runAndReturn(() => {
      setRequest(request);
      return handler(request, helper);
    });
  };
}

function register(server, options) {
  setServer(server);

  server.events.on('route', route => {
    /* eslint-disable no-param-reassign */
    route.settings.handler = wrapHandler(route.settings.handler);
  });
}

module.exports.plugin = {
  name: 'logger-context',
  version: '1.0.0',
  register,
  hanlderHooker: wrapHandler,
};
