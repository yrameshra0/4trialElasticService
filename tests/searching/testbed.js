const elasticResponse = {
  took: 8,
  timed_out: false,
  _shards: {
    total: 5,
    successful: 5,
    skipped: 0,
    failed: 0,
  },
  hits: {
    total: 3,
    max_score: 0,
    hits: [],
  },
  aggregations: {
    '100': {
      doc_count_error_upper_bound: 0,
      sum_other_doc_count: 0,
      buckets: [
        {
          key: 'en',
          doc_count: 2,
          idsGroups: {
            doc_count_error_upper_bound: 0,
            sum_other_doc_count: 0,
            buckets: [
              {
                key: 'movieId:19991',
                doc_count: 1,
              },
              {
                key: 'movieId:19993',
                doc_count: 1,
              },
            ],
          },
          aggs: {
            hits: {
              total: 2,
              max_score: 1,
              hits: [
                {
                  _index: 'movies',
                  _type: '_doc',
                  _id: 'movieId:19991',
                  _score: 1,
                  _source: {
                    id: 'movieId:19991',
                    name: 'Avatar',
                    title: 'Avatar',
                    originalLanguage: 'en',
                  },
                },
                {
                  _index: 'movies',
                  _type: '_doc',
                  _id: 'movieId:19993',
                  _score: 1,
                  _source: {
                    id: 'movieId:19993',
                    name: 'Zvatar',
                    title: 'Zvatar',
                    originalLanguage: 'en',
                  },
                },
              ],
            },
          },
        },
        {
          key: 'de',
          doc_count: 1,
          idsGroups: {
            doc_count_error_upper_bound: 0,
            sum_other_doc_count: 0,
            buckets: [
              {
                key: 'movieId:19992',
                doc_count: 1,
              },
            ],
          },
          aggs: {
            hits: {
              total: 1,
              max_score: 1,
              hits: [
                {
                  _index: 'movies',
                  _type: '_doc',
                  _id: 'movieId:19992',
                  _score: 1,
                  _source: {
                    id: 'movieId:19992',
                    name: 'Bvatar',
                    title: 'Bvatar',
                    originalLanguage: 'de',
                  },
                },
              ],
            },
          },
        },
      ],
    },
    '101': {
      doc_count_error_upper_bound: 0,
      sum_other_doc_count: 0,
      buckets: [
        {
          key: 'en',
          doc_count: 2,
          idsGroups: {
            doc_count_error_upper_bound: 0,
            sum_other_doc_count: 0,
            buckets: [
              {
                key: 'movieId:19991',
                doc_count: 1,
              },
              {
                key: 'movieId:19993',
                doc_count: 1,
              },
            ],
          },
          aggs: {
            hits: {
              total: 2,
              max_score: 1,
              hits: [
                {
                  _index: 'movies',
                  _type: '_doc',
                  _id: 'movieId:19991',
                  _score: 1,
                  _source: {
                    id: 'movieId:19991',
                    name: 'Avatar',
                    title: 'Avatar',
                    originalLanguage: 'en',
                  },
                },
                {
                  _index: 'movies',
                  _type: '_doc',
                  _id: 'movieId:19993',
                  _score: 1,
                  _source: {
                    id: 'movieId:19993',
                    name: 'Zvatar',
                    title: 'Zvatar',
                    originalLanguage: 'en',
                  },
                },
              ],
            },
          },
        },
      ],
    },
    '102': {
      doc_count_error_upper_bound: 0,
      sum_other_doc_count: 0,
      buckets: [
        {
          key: 'en',
          doc_count: 2,
          idsGroups: {
            doc_count_error_upper_bound: 0,
            sum_other_doc_count: 0,
            buckets: [
              {
                key: 'movieId:19991',
                doc_count: 1,
              },
              {
                key: 'movieId:19993',
                doc_count: 1,
              },
            ],
          },
          aggs: {
            hits: {
              total: 2,
              max_score: 1,
              hits: [
                {
                  _index: 'movies',
                  _type: '_doc',
                  _id: 'movieId:19991',
                  _score: 1,
                  _source: {
                    id: 'movieId:19991',
                    name: 'Avatar',
                    title: 'Avatar',
                    originalLanguage: 'en',
                  },
                },
                {
                  _index: 'movies',
                  _type: '_doc',
                  _id: 'movieId:19993',
                  _score: 1,
                  _source: {
                    id: 'movieId:19993',
                    name: 'Zvatar',
                    title: 'Zvatar',
                    originalLanguage: 'en',
                  },
                },
              ],
            },
          },
        },
      ],
    },
    '103': {
      doc_count_error_upper_bound: 0,
      sum_other_doc_count: 0,
      buckets: [
        {
          key: 'en',
          doc_count: 2,
          idsGroups: {
            doc_count_error_upper_bound: 0,
            sum_other_doc_count: 0,
            buckets: [
              {
                key: 'movieId:19991',
                doc_count: 1,
              },
              {
                key: 'movieId:19993',
                doc_count: 1,
              },
            ],
          },
          aggs: {
            hits: {
              total: 2,
              max_score: 1,
              hits: [
                {
                  _index: 'movies',
                  _type: '_doc',
                  _id: 'movieId:19991',
                  _score: 1,
                  _source: {
                    id: 'movieId:19991',
                    name: 'Avatar',
                    title: 'Avatar',
                    originalLanguage: 'en',
                  },
                },
                {
                  _index: 'movies',
                  _type: '_doc',
                  _id: 'movieId:19993',
                  _score: 1,
                  _source: {
                    id: 'movieId:19993',
                    name: 'Zvatar',
                    title: 'Zvatar',
                    originalLanguage: 'en',
                  },
                },
              ],
            },
          },
        },
      ],
    },
    '104': {
      doc_count_error_upper_bound: 0,
      sum_other_doc_count: 0,
      buckets: [
        {
          key: 'en',
          doc_count: 2,
          idsGroups: {
            doc_count_error_upper_bound: 0,
            sum_other_doc_count: 0,
            buckets: [
              {
                key: 'movieId:19991',
                doc_count: 1,
              },
              {
                key: 'movieId:19993',
                doc_count: 1,
              },
            ],
          },
          aggs: {
            hits: {
              total: 2,
              max_score: 1,
              hits: [
                {
                  _index: 'movies',
                  _type: '_doc',
                  _id: 'movieId:19991',
                  _score: 1,
                  _source: {
                    id: 'movieId:19991',
                    name: 'Avatar',
                    title: 'Avatar',
                    originalLanguage: 'en',
                  },
                },
                {
                  _index: 'movies',
                  _type: '_doc',
                  _id: 'movieId:19993',
                  _score: 1,
                  _source: {
                    id: 'movieId:19993',
                    name: 'Zvatar',
                    title: 'Zvatar',
                    originalLanguage: 'en',
                  },
                },
              ],
            },
          },
        },
      ],
    },
    '105': {
      doc_count_error_upper_bound: 0,
      sum_other_doc_count: 0,
      buckets: [],
    },
    '106': {
      doc_count_error_upper_bound: 0,
      sum_other_doc_count: 0,
      buckets: [
        {
          key: 'en',
          doc_count: 2,
          idsGroups: {
            doc_count_error_upper_bound: 0,
            sum_other_doc_count: 0,
            buckets: [
              {
                key: 'movieId:19991',
                doc_count: 1,
              },
              {
                key: 'movieId:19993',
                doc_count: 1,
              },
            ],
          },
          aggs: {
            hits: {
              total: 2,
              max_score: 1,
              hits: [
                {
                  _index: 'movies',
                  _type: '_doc',
                  _id: 'movieId:19991',
                  _score: 1,
                  _source: {
                    id: 'movieId:19991',
                    name: 'Avatar',
                    title: 'Avatar',
                    originalLanguage: 'en',
                  },
                },
                {
                  _index: 'movies',
                  _type: '_doc',
                  _id: 'movieId:19993',
                  _score: 1,
                  _source: {
                    id: 'movieId:19993',
                    name: 'Zvatar',
                    title: 'Zvatar',
                    originalLanguage: 'en',
                  },
                },
              ],
            },
          },
        },
      ],
    },
  },
};

const { aggregations } = elasticResponse;
const userIds = Object.keys(aggregations);

const response = userIds.map(user => {
  const movies = aggregations[user].buckets
    .reduce((acc, val) => {
      const { hits } = val.aggs.hits;
      /* eslint-disable no-underscore-dangle */
      const titles = hits.map(movie => movie._source.title);
      return [...acc, ...titles];
    }, [])
    .sort();
  return {
    user,
    movies,
  };
});

console.log(JSON.stringify(response));
