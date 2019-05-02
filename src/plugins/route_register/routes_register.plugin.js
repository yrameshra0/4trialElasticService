const fs = require('fs');
const util = require('util');

const isTest = (process.env.NODE_ENV || 'test').toLowerCase() === 'test';

async function recursivePathBuilder(srcDir, passOn = []) {
  let files = await util.promisify(fs.readdir)(srcDir);
  files = files.map(directory => `${srcDir}/${directory}`);
  files.forEach(file => passOn.push(file));
  await Promise.all(files.filter(file => !file.match(/\./)).map(dir => recursivePathBuilder(dir, passOn)));
  return passOn;
}

async function apisToLoad() {
  const source = 'src';
  const srcDir = __dirname.substring(0, __dirname.indexOf(source) + source.length);
  const files = await recursivePathBuilder(srcDir);

  const apiListings = files.filter(file => file.match(/\/api\//));

  if (isTest) {
    return apiListings.filter(file => file.match(/(_{2}).+(_{2})/));
  }

  return apiListings;
}
async function initRoutes() {
  const apis = await apisToLoad();
  /* eslint-disable-next-line */
  const loadedFiles = await Promise.all(apis.map(file => require(file)));
  return loadedFiles;
}

async function register(server, options) {
  const allRoutes = await initRoutes();
  allRoutes.forEach(route => {
    if (!Array.isArray(route)) {
      server.route(route);
      return;
    }
    route.forEach(innerRoute => server.route(innerRoute));
  });
}

module.exports.plugin = {
  name: 'Route Discovery',
  version: '1.0.0',
  register,
};
