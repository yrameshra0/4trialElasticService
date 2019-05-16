const { Transform } = require('stream');

class CreditsTransformer extends Transform {
  constructor(highWaterMark = 1) {
    const objectMode = true;
    super({ objectMode, highWaterMark });
    this.type = 'cast';
  }

  _transform(movieInfo, encoding, callback) {
    const { title } = movieInfo;
    const movieId = movieInfo.movie_id;

    movieInfo.cast.forEach(castMember => {
      const { name } = castMember;
      const castId = castMember.cast_id;

      this.push({
        id: `movieId:${movieId}::castId:${castId}`,
        movieId,
        title,
        name,
      });
    });

    movieInfo.crew
      .filter(val => (val.job && val.job.toLowerCase()) === 'director')
      .forEach(crewMember => {
        const { name, id } = crewMember;

        this.push({
          id: `movieId:${movieId}::crewId:${id}`,
          movieId,
          title,
          name,
        });
      });

    callback();
  }
}
module.exports = CreditsTransformer;
