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
        name: { type: 'keyword' },
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

async function search(term, offset = 0) {
  const index = 'movies';
  const body = {
    query: {
      wildcard: {
        name: `*${term}*`,
      },
    },
    _source: ['name', 'title', 'type'],
  };
  return client.search({ index, type: '_doc', body });
}

async function findAll(awaiter) {
  return client.search({
    index: 'movies',
    type: '_doc',
    body: {
      query: {
        match_all: {},
      },
    },
  });
}

async function init() {
  const result = await client.ping({ requestTimeout: 1000 });

  // await resetIndex();
  await search('Tom Hanks');
  // await findAll();
}
setImmediate(async () => init());
