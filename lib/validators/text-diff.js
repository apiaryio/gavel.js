const errors = require('../errors');

class TextDiff {
  constructor(expected) {
    if (typeof expected !== 'string') {
      const outError = new errors.DataNotStringError(
        'String validator expected: input data is not string'
      );
      outError.data = expected;
      throw outError;
    }

    this.expected = expected;
  }

  validate(actual) {
    if (typeof actual !== 'string') {
      const outError = new errors.DataNotStringError(
        'String validator actual: input data is not string'
      );
      outError.data = actual;
      throw outError;
    }

    this.valid = actual === this.expected;

    return this.valid
      ? []
      : [
          {
            message: 'Actual and expected data do not match.'
          }
        ];
  }
}

module.exports = { TextDiff };
