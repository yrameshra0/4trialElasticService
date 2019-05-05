const loggerContext = require('../logger_context.js');

describe('logger context', () => {
  test('setup logger context', () => {
    expect(loggerContext.getContext()).toBeDefined();
  });

  test('use context to set values', async () => {
    const context = loggerContext.getContext();
    const functionCall = () => {
      const localContext = loggerContext.getContext();
      return localContext.get('my-key');
    };

    const valueInsideTimer = () => {
      return new Promise(resolve =>
        setImmediate(() => {
          const localContext = loggerContext.getContext();
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
});
