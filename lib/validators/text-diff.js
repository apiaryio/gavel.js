const DiffMatchPatch = require('googlediff');
const errors = require('../errors');

class TextDiff {
  constructor(real, expected) {
    if (typeof real !== 'string') {
      const outError = new errors.DataNotStringError(
        'String validator real: input data is not string'
      );
      outError.data = real;
      throw outError;
    }

    if (typeof expected !== 'string') {
      const outError = new errors.DataNotStringError(
        'String validator expected: input data is not string'
      );
      outError.data = expected;
      throw outError;
    }

    this.real = real;
    this.expected = expected;
  }

  validate() {
    const sanitizeSurrogatePairs = (data) => {
      return data
        .replace(/[\uD800-\uDBFF]/g, '')
        .replace(/[\uDC00-\uDFFF]/g, '');
    };

    this.output = null;
    const dmp = new DiffMatchPatch();

    try {
      const patch = dmp.patch_make(this.real, this.expected);
      this.output = dmp.patch_toText(patch);
      return this.output;
    } catch (error) {
      if (error instanceof URIError) {
        const patch = dmp.patch_make(
          sanitizeSurrogatePairs(this.real),
          sanitizeSurrogatePairs(this.expected)
        );
        this.output = dmp.patch_toText(patch);
        return this.output;
      }

      throw error;
    }
  }

  evaluateOutputToResults(data) {
    if (!data) {
      data = this.output;
    }

    if (!data) {
      return [];
    }

    return [
      {
        // TODO Improve the message to contain real and expected data
        message: 'Real and expected data does not match.'
      }
    ];
  }
}

module.exports = { TextDiff };
