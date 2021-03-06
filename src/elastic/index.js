const client = require('./_client');
const config = require('../config');
const logger = require('../logger');

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
        id: { type: 'keyword' },
        title: { type: 'keyword' },
        name: {
          type: 'text',
          fields: {
            raw: {
              type: 'keyword',
            },
          },
        },
        originalLanguage: { type: 'keyword' },
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

function searchBody(searchTerm, preferences) {
  const matchBlockGenerator = (items, key = 'name') =>
    items.map(item => ({
      match: {
        [key]: item,
      },
    }));

  return {
    query: {
      bool: {
        must: matchBlockGenerator([searchTerm]),
        should: [...matchBlockGenerator([...preferences.actors, ...preferences.directors]), ...matchBlockGenerator(preferences.langaugages, 'originalLanguage')],
      },
    },
    sort: [{ title: 'asc' }],
  };
}

async function searchWithTerm({ searchTerm, preferences }) {
  logger.info('Forwarding search for term to elastic:', { searchTerm, preferences });
  const type = '_doc';
  const body = searchBody(searchTerm, preferences);

  return client.search({ index, type, body });
}

async function searchWithQuery(body) {
  logger.info('Forwarding search for query to elastic:', body);
  const type = '_doc';

  return client.search({ index, type, body });
}

module.exports = {
  bulkUpload,
  resetIndex,
  searchWithTerm,
  searchWithQuery,
};
