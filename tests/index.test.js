const index = require('../src');

describe('Server Setup ', () => {
  afterEach(async () => {
    await index.stop();
  });

  beforeEach(async () => {
    await index.stop();
  });

  test('Server Initialized', async () => {
    await expect(index.init()).resolves.toBeDefined();
  });

  test('Server Started', async () => {
    await expect(index.start()).resolves.toBeDefined();
  });
});
