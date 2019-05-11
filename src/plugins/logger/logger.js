const { inspect } = require('util');
const { getRequest, getServer } = require('./logger_context');

/* eslint-disable no-console */
function consoleLog(type, message, data) {
  const consoles = {
    info: console.info,
    warn: console.warn,
    error: console.error,
    debug: console.debug,
  };

  if (Object.keys(data).length === 0) {
    consoles[type](message);
    return;
  }

  consoles[type](message, inspect(data, false, 1));
}

const logOverConext = (type, message, data) => {
  try {
    const request = getRequest();
    if (request) {
      request.log(type, { message, data });
      return true;
    }

    const server = getServer();
    if (server) {
      server.log(type, { message, data });
      return true;
    }
  } catch (error) {
    // no-op
  }
  return false;
};

function log(type, message, data) {
  const dataReducer = data.reduce((acc, val) => {
    return Object.assign(acc, { ...val });
  }, {});

  if (!logOverConext(type, message, data)) {
    consoleLog(type, message, dataReducer);
  }
}

module.exports = {
  info: (message, ...rest) => {
    log('info', message, rest);
  },
  debug: (message, ...rest) => {
    log('debug', message, rest);
  },
  warn: (message, ...rest) => {
    log('warn', message, rest);
  },
  error: (message, ...rest) => {
    log('error', message, rest);
  },
};