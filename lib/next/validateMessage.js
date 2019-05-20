const isset = require('../utils/isset');
const { normalize } = require('./units/normalize');
const { validateStatusCode } = require('./units/validateStatusCode');
const { validateHeaders } = require('./units/validateHeaders');
const { validateBody } = require('./units/validateBody');

function validateMessage(realMessage, expectedMessage) {
  const real = normalize(realMessage);
  const expected = normalize(expectedMessage);
  const results = {};

  if (real.statusCode) {
    results.statusCode = validateStatusCode(real, expected);
  }

  if (real.headers && expected.headers) {
    results.headers = validateHeaders(real, expected);
  }

  if (
    isset(real.body) &&
    (isset(expected.body) || isset(expected.bodySchema))
  ) {
    results.body = validateBody(real, expected);
  }

  return results;
}

module.exports = { validateMessage };
