const cls = require('continuation-local-storage');
const { logger, setup } = require('../logger');

const loggerContext = 'logger-context-test';

describe('logger functionality', () => {
  test('when initalization not done and without complex object', () => {
    ['info', 'warn', 'error', 'debug'].forEach(type => {
      const spy = jest.spyOn(console, type);

      logger[type]('Without any initializaton');
      expect(spy).toBeCalledWith('Without any initializaton');

      spy.mockRestore();
      spy.mockReset();
    });
  });

  test('when initalization not done with complex object', () => {
    ['info', 'warn', 'error', 'debug'].forEach(type => {
      const spy = jest.spyOn(console, type);

      logger[type]('Without any initializaton', { more: 'data' });
      expect(spy).toBeCalledWith('Without any initializaton', `{ more: 'data' }`);

      spy.mockRestore();
      spy.mockReset();
    });
  });

  test('request logging', () => {
    const namespace = cls.createNamespace(loggerContext);
    const request = {
      log: (type, { message, data }) => {
        expect(type).toBe('info');
        expect(message).toBe('With Request Initialization');
        expect(data).toBeDefined();
      },
    };

    setup(loggerContext);
    namespace.run(() => {
      namespace.set('request', request);
      logger.info('With Request Initialization', { more: 'data' });
    });
  });

  test('server logging', () => {
    const namespace = cls.createNamespace(loggerContext);
    const server = {
      log: (type, { message, data }) => {
        expect(type).toBe('info');
        expect(message).toBe('With Request Initialization');
        expect(data).toBeDefined();
      },
    };

    setup(loggerContext);
    namespace.run(() => {
      namespace.set('server', server);
      logger.info('With Request Initialization', { more: 'data' });
    });
  });
});
