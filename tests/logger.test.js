const { getContext, setRequest, setServer } = require('../src/plugins/logger/logger_context');
const logger = require('../src/logger');

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
    const context = getContext();
    const request = {
      log: (type, { message, data }) => {
        expect(type).toBe('info');
        expect(message).toBe('With Request Initialization');
        expect(data).toBeDefined();
      },
    };

    context.run(() => {
      setRequest(request);
      logger.info('With Request Initialization', { more: 'data' });
    });
  });

  test('server logging', () => {
    const context = getContext();
    const server = {
      log: (type, { message, data }) => {
        expect(type).toBe('info');
        expect(message).toBe('With Request Initialization');
        expect(data).toBeDefined();
      },
    };

    context.run(() => {
      setServer(server);
      logger.info('With Request Initialization', { more: 'data' });
    });
  });
});
