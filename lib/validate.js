const isset = require('./utils/isset');
const { coerce, coerceWeak } = require('./units/coerce');
const { normalize } = require('./units/normalize');
const { isValidResult } = require('./units/isValid');
const { validateMethod } = require('./units/validateMethod');
const { validateURI } = require('./units/validateURI');
const { validateStatusCode } = require('./units/validateStatusCode');
const { validateHeaders } = require('./units/validateHeaders');
const { validateBody } = require('./units/validateBody');

function validate(expectedMessage, actualMessage) {
  const result = {};
  const fields = {};

  // Uses strict coercion on real message.
  // Strict coercion ensures that real message always has properties
  // illegible for validation with the expected message, even if they
  // are not present in the real message.
  const actual = normalize(coerce(actualMessage));

  // Use weak coercion on expected message.
  // Weak coercion will transform only the properties present in the
  // expected message. Properties meant for coercion, but not provided
  // in the expected message are left out, as we don't want to mutate
  // user's assertion.
  const expected = normalize(coerceWeak(expectedMessage));

  if (expected.method) {
    fields.method = validateMethod(expected, actual);
  }

  if (expected.uri) {
    fields.uri = validateURI(expected, actual);
  }

  if (expected.statusCode) {
    fields.statusCode = validateStatusCode(expected, actual);
  }

  if (expected.headers) {
    fields.headers = validateHeaders(expected, actual);
  }

  if (isset(expected.body) || isset(expected.bodySchema)) {
    fields.body = validateBody(expected, actual);
  }

  // Indicates the validity of the actual message
  result.valid = isValidResult(fields);
  result.fields = fields;

  return result;
}

module.exports = { validate };
