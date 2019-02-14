const { Transform } = require('stream');

class CreditsTransformer extends Transform {
  constructor(highWaterMark = 1) {
    const objectMode = true;
    super({ objectMode, highWaterMark });
    this.type = 'cast';
  }

  _transform(movieInfo, encoding, callback) {
    movieInfo.cast.forEach((castMember) => {
      const { title } = movieInfo;
      const {
        character, name, gender,
      } = castMember;
      const movieId = movieInfo.movie_id;
      const castId = castMember.cast_id;

      this.push({
        id: `movieId:${movieId}::castId:${castId}`,
        movieId,
        title,
        castId,
        character,
        name,
        gender,
        type: this.type,
      });
    });
    callback();
  }
}
module.exports = CreditsTransformer;
