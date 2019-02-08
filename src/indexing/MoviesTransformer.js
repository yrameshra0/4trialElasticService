const { Transform } = require('stream');

class MoviesTransformer extends Transform {
  constructor(highWaterMark = 1) {
    const objectMode = true;
    super({ objectMode, highWaterMark });
    this.type = 'movie';
  }

  _transform(movieInfo, encoding, callback) {
    const { title, id } = movieInfo;
    const originalLanguage = movieInfo.original_language;
    this.push({
      id,
      title,
      originalLanguage,
      type: this.type,
    });
    callback();
  }
}
module.exports = MoviesTransformer;
