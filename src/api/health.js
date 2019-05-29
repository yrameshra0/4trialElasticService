module.exports = {
  path: '/health',
  method: 'GET',
  handler: () => {
    return { status: 'OK' };
  },
  options: {},
};
