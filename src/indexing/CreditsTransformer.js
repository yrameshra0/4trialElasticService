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

    movieInfo.cast.forEach((castMember) => {
      const {
        character, name, gender,
      } = castMember;
      const castId = castMember.cast_id;

      this.push({
        id: `movieId:${movieId}::castId:${castId}`,
        movieId,
        title,
        castId,
        character,
        name,
        gender,
        type: 'cast',
      });
    });

    movieInfo.crew
      .filter(val => val.job && val.job === 'Director')
      .forEach((crewMember) => {
        const {
          job, name, gender, id,
        } = crewMember;

        this.push({
          id: `movieId:${movieId}::crewId:${id}`,
          movieId,
          title,
          crewId: id,
          name,
          job,
          gender,
          type: 'crew',
        });
      });
    callback();
  }
}
module.exports = CreditsTransformer;
