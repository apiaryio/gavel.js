const errors = require('../errors');

// const sanitizeSurrogatePairs = (data) => {
//   return data.replace(/[\uD800-\uDBFF]/g, '').replace(/[\uDC00-\uDFFF]/g, '');
// };

class TextDiff {
  constructor(expected, actual) {
    if (typeof actual !== 'string') {
      const outError = new errors.DataNotStringError(
        'String validator actual: input data is not string'
      );
      outError.data = actual;
      throw outError;
    }

    if (typeof expected !== 'string') {
      const outError = new errors.DataNotStringError(
        'String validator expected: input data is not string'
      );
      outError.data = expected;
      throw outError;
    }

    this.expected = expected;
    this.actual = actual;
  }

  validate() {
    this.valid = this.actual === this.expected;
  }

  evaluateOutputToResults() {
    if (this.valid) {
      return [];
    }

    return [
      {
        message: 'Actual and expected data do not match.',
        values: {
          expected: this.expected,
          actual: this.actual
        }
      }
    ];
  }
}

module.exports = { TextDiff };
