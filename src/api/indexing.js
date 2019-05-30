const { uploadToElastic } = require('../indexing');
const log = require('../logger');

module.exports = {
  path: '/index',
  method: 'GET',
  handler: async () => {
    log.info('Indexing');
    await uploadToElastic();
    return { uploadToElastic: 'OK' };
  },
  options: {
    auth: 'simple',
  },
};
