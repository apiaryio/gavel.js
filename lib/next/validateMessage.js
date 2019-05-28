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

  // Weak coercion applies transformation only to the properties
  // present in the given message. We don't want to mutate user's assertion.
  // However, we do want to use the same coercion logic we do
  // for strict coercion. Thus normalization and coercion are separate.
  const expected = normalize(coerceWeak(expectedMessage));

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

  // Indicates the validity of the real message
  results.isValid = isValid(results);

  return results;
}

module.exports = { validateMessage };
