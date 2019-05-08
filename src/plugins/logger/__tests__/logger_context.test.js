const { getContext, setRequest, setServer, getRequest, getServer } = require('../logger_context.js');

describe('logger context', () => {
  test('setup logger context', () => {
    expect(getContext()).toBeDefined();
  });

  test('use context to set values', async () => {
    const context = getContext();
    const functionCall = () => {
      const localContext = getContext();
      return localContext.get('my-key');
    };

    const valueInsideTimer = () => {
      return new Promise(resolve =>
        setImmediate(() => {
          const localContext = getContext();
          resolve(localContext.get('my-key'));
        }),
      );
    };

    await context.runAndReturn(async () => {
      context.set('my-key', 'my-value');
      expect(functionCall()).toBe('my-value');
      await expect(valueInsideTimer()).resolves.toBe('my-value');
    });
  });

  test('context sets request', async () => {
    const context = getContext();
    await context.runAndReturn(async () => {
      setRequest('my-request');

      expect(getRequest()).toBe('my-request');
    });
  });

  test('context sets server', async () => {
    setServer('my-server');

    expect(getServer()).toBe('my-server');
  });
});
