module.exports = {
  body: {
    query: {
      bool: {
        must: [
          {
            match: {
              name: 'Sam',
            },
          },
        ],
        should: [
          {
            match: {
              name: 'Sam Worthington',
            },
          },
          {
            match: {
              name: 'Tom Hanks',
            },
          },
        ],
      },
    },
  },
  index: 'movies',
  type: '_doc',
};
