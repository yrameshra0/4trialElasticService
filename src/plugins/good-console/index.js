const Good = require('good');
const GoodConsole = require('good-console');

const options = {
  ops: {
    interval: 10000,
  },
  reporters: {
    myConsoleReporter: [new GoodConsole({ format: 'YYYY-MM-DDTHH:mm:ss.SSS' }), 'stdout'],
  },
};

module.exports = {
  plugin: Good,
  options,
};
