const isset = require('./utils/isset');
const { coerce, coerceWeak } = require('./units/coerce');
const { normalize } = require('./units/normalize');
const { isValidResult } = require('./units/isValid');
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
  // Strict coercion ensures that real message always has properties
  // illegible for validation with the expected message, even if they
  // are not present in the real message.
  const real = normalize(coerce(realMessage));

  // Use weak coercion on expected message.
  // Weak coercion will transform only the properties present in the
  // expected message. Properties meant for coercion, but not provided
  // in the expected message are left out, as we don't want to mutate
  // user's assertion.
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
  result.valid = isValidResult(result);

  return result;
}

module.exports = { validate };
