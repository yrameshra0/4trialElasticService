const { Transform } = require('stream');

class CSVLineTOJSONObject extends Transform {
  constructor(highWaterMark = 1) {
    const objectMode = true;
    super({ objectMode, highWaterMark });
    this.csvHeader = null;
  }

  _transform(chunk, encoding, callback) {
    // First Line would only contain csv post that json's would be poured in
    if (this.csvHeader === null) {
      this.csvHeader = chunk.split(',');
    } else {
      const splittedUp = chunk.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/g);
      const json = {};
      splittedUp.forEach((element, index) => {
        const cleaned = element.replace(/""/g, '"').replace(/^"(.+(?="$))"$/g, '$1');
        json[this.csvHeader[index]] = this.jsonOrElseValue(cleaned);
      });
      this.push(json);
    }
    callback();
  }

  /* eslint-disable class-methods-use-this */
  jsonOrElseValue(cleaned) {
    try {
      return JSON.parse(cleaned);
    } catch (error) {
      return cleaned;
    }
  }
}
module.exports = CSVLineTOJSONObject;
