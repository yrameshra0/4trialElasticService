const client = require('./');
const config = require('../config');

const { index } = config;

async function bulkUploadWithRetry(data, trail = 0, maxRetries = 2) {
  try {
    return await client.bulk({ body: data });
  } catch (err) {
    if (trail < maxRetries) {
      await new Promise(resolve => setTimeout(resolve, 1000 * 2 ** trail));
      // eslint-disable-next-line no-return-await
      return await bulkUploadWithRetry(data, trail + 1, maxRetries);
    }
    throw err;
  }
}

async function bulkUpload(data = []) {
  const blukData = data.reduce((acc, val) => {
    acc.push({ index: { _index: index, _type: '_doc', _id: val.id } });
    acc.push(val);
    return acc;
  }, []);
  await bulkUploadWithRetry(blukData);
}

async function createIndex() {
  const mappings = {
    _doc: {
      properties: {
        character: { type: 'text' },
        title: { type: 'text' },
        name: { type: 'text' },
        originalLanguage: { type: 'text' },
        job: { type: 'text' },
      },
    },
  };
  await client.indices.create({ index, body: { mappings } });
}

async function resetIndex() {
  if (await client.indices.exists({ index })) {
    await client.indices.delete({ index });
  }

  await createIndex();
}

module.exports = {
  bulkUpload,
  resetIndex,
};