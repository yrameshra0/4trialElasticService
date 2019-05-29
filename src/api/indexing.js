const { uploadToElastic } = require('../indexing');

module.exports = {
  path: '/index',
  method: 'GET',
  handler: async () => {
    await uploadToElastic();
    return { uploadToElastic: 'OK' };
  },
  options: {},
};
