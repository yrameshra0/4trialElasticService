const cls = require('cls-hooked');

const isTest = () => (process.env.NODE_ENV || 'test').toLowerCase() === 'test';

const currentContextKey = () => (isTest() ? 'logger-context-test' : 'logger-context');

function getContext() {
  const contextKey = currentContextKey();

  if (!cls.getNamespace(contextKey)) return cls.createNamespace(contextKey);

  return cls.getNamespace(contextKey);
}
module.exports = {
  getContext,
};
