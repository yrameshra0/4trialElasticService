const { Client } = require('elasticsearch');
const { elasticConfig } = require('./config');

const elasticClient = new Client({ ...elasticConfig });

async function bulkUploadWithRetry(data, trail = 0, maxRetries = 2) {
  try {
    return await elasticClient.bulk({ body: data });
  } catch (err) {
    if (trail < maxRetries) {
      await new Promise(resolve => setTimeout(resolve, 1000 * (2 ** trail)));
      return await bulkUploadWithRetry(data, (trail + 1), maxRetries);
    } throw err;
  }
}

async function bulkUpload(data = []) {
  const blukData = data.reduce((acc, val) => {
    acc.push({ indesx: { _index: 'movies', _type: val.type, _id: val.id } });
    acc.push(val);
    return acc;
  }, []);
  await bulkUploadWithRetry(blukData);
}


module.exports = {
  bulkUpload,
};
