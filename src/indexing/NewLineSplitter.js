const { Transform } = require('stream');

class NewLineSplitter extends Transform {
  constructor(highWaterMark = 1) {
    const objectMode = true;
    super({ objectMode, highWaterMark });
    this.buffer = '';
  }

  eolLocation() {
    return this.buffer.indexOf('\n');
  }

  pushLines() {
    while (this.eolLocation() > 0) {
      let eol = this.eolLocation();
      eol = eol === -1 ? this.buffer.length : eol;
      const line = this.buffer.substring(0, eol);
      this.push(line);
      this.buffer = this.buffer.slice(eol + 1);
    }
  }

  _transform(chunk, encoding, callback) {
    this.buffer += chunk;
    this.pushLines();
    callback();
  }

  _flush(callback) {
    this.pushLines();
    if (this.buffer.length > 0) {
      this.push(this.buffer);
      this.buffer = '';
    }
    callback();
  }
}

module.exports = NewLineSplitter;
