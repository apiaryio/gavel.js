const isset = require('../utils/isset');
const { coerce, coerceWeak } = require('./units/coerce');
const { normalize } = require('./units/normalize');
const { isValid } = require('./units/isValid');
const { validateMethod } = require('./units/validateMethod');
const { validateURI } = require('./units/validateURI');
const { validateStatusCode } = require('./units/validateStatusCode');
const { validateHeaders } = require('./units/validateHeaders');
const { validateBody } = require('./units/validateBody');

function validate(expectedMessage, realMessage) {
  const result = {
    fields: {}
  };

  // Uses strict coercion on real message.
  // Strict coercion ensures real message has properties illegible
  // for validation with the expected message.
  const real = normalize(coerce(realMessage));

  // Use weak coercion on expected message.
  // This means that only the properties present in expected message
  // will be coerced. We don't want to mutate user's assertion.
  // However, we want to use the same coercion logic for any coercion type.
  const expected = normalize(coerceWeak(expectedMessage));

  if (expected.method) {
    result.fields.method = validateMethod(expected, real);
  }

  if (expected.uri) {
    result.fields.uri = validateURI(expected, real);
  }

  if (expected.statusCode) {
    result.fields.statusCode = validateStatusCode(expected, real);
  }

  if (expected.headers) {
    result.fields.headers = validateHeaders(expected, real);
  }

  if (isset(expected.body) || isset(expected.bodySchema)) {
    result.fields.body = validateBody(expected, real);
  }

  // Indicates the validity of the real message
  result.isValid = isValid(result);

  return result;
}

module.exports = { validate };
