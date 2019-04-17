/* eslint-disable no-unused-vars */
const fs = require('fs');
const elasticSearch = require('elasticsearch');

const client = new elasticSearch.Client({
  host: 'localhost:9200',
  log: 'trace',
});

async function createIndex() {
  const index = 'movies';
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
  const index = 'movies';
  if (await client.indices.exists({ index })) {
    await client.indices.delete({ index });
  }

  await createIndex();
}

async function init() {
  const result = await client.ping({ requestTimeout: 1000 });

  await resetIndex();
  await require('./StoreToElastic');
}
setImmediate(async () => init());
