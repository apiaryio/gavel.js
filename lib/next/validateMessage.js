const isset = require('../utils/isset');
const { coerce, coerceWeak } = require('./units/coerce');
const { normalize } = require('./units/normalize');
const { isValid } = require('./units/isValid');
const { validateStatusCode } = require('./units/validateStatusCode');
const { validateHeaders } = require('./units/validateHeaders');
const { validateBody } = require('./units/validateBody');

function validateMessage(realMessage, expectedMessage) {
  const results = {};

  // Uses strict coercion on real message.
  // Strict coercion ensures real message has properties illegible
  // for validation with the expected message.
  const real = normalize(coerce(realMessage));

  // Use weak coercion on expected message.
  // This means that only the properties present in expected message
  // will be coerced. We don't want to mutate user's assertion.
  // However, we want to use the same coercion logic for any coercion type.
  const expected = normalize(coerceWeak(expectedMessage));

  if (expected.statusCode) {
    results.statusCode = validateStatusCode(real, expected);
  }

  if (expected.headers) {
    results.headers = validateHeaders(real, expected);
  }

  if (isset(expected.body) || isset(expected.bodySchema)) {
    results.body = validateBody(real, expected);
  }

  // Indicates the validity of the real message
  results.isValid = isValid(results);

  return results;
}

module.exports = { validateMessage };
