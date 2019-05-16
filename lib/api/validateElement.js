const isset = require('../utils/isset');
const { validateStatusCode } = require('./units/validateStatusCode');
const { validateHeaders } = require('./units/validateHeaders');
const { validateBody } = require('./units/validateBody');

function validateElement(real, expected) {
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

module.exports = { validateElement };
