const cls = require('cls-hooked');

const isTest = () => (process.env.NODE_ENV || 'test').toLowerCase() === 'test';
const serverKey = 'server';
const requestKey = 'request';

const currentContextKey = () => (isTest() ? 'logger-context-test' : 'logger-context');

function getContext() {
  const contextKey = currentContextKey();

  if (!cls.getNamespace(contextKey)) return cls.createNamespace(contextKey);

  return cls.getNamespace(contextKey);
}
module.exports = {
  getContext,
  getServer: () => getContext().get(serverKey),
  getRequest: () => getContext().get(requestKey),
  setServer: server => getContext().set(serverKey, server),
  setRequest: request => getContext().set(requestKey, request),
};
