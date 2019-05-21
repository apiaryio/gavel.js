const { TextDiff } = require('../../validators/text-diff');

const APIARY_STATUS_CODE_TYPE = 'text/vnd.apiary.status-code';

/**
 * Validates given real and expected status codes.
 * @param {Object} real
 * @param {number} expected
 */
function validateStatusCode(real, expected) {
  const validator = new TextDiff(real.statusCode, expected.statusCode);
  const rawData = validator.validate();
  const results = validator.evaluateOutputToResults();

  return {
    validator: 'TextDiff',
    realType: APIARY_STATUS_CODE_TYPE,
    expectedType: APIARY_STATUS_CODE_TYPE,
    rawData,
    results: results.map((result) =>
      Object.assign({}, result, {
        message:
          result.message === 'Real and expected data does not match.'
            ? `Status code is '${real.statusCode}' instead of '${
                expected.statusCode
              }'`
            : result.message
      })
    )
  };
}

module.exports = { validateStatusCode };
