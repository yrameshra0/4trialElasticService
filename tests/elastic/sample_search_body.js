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
              name: 'Denzel Washington',
            },
          },
          {
            match: {
              name: 'Anne Hathaway',
            },
          },
          {
            match: {
              name: 'Tom Hanks',
            },
          },
          {
            match: {
              name: 'Guy Ritchie',
            },
          },
          {
            match: {
              name: 'Quentin Tarantino',
            },
          },
          {
            match: {
              originalLanguage: 'English',
            },
          },
        ],
      },
    },
    sort: [
      {
        name: 'asc',
      },
    ],
  },
  index: 'movies',
  type: '_doc',
};
