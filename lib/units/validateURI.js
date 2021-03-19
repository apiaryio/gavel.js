const parse = require('url-parse');
const deepEqual = require('deep-equal');

/**
 * Parses the given URI and returns the properties
 * elligible for comparison. Leaves out raw properties like "path"
 * that cannot be compared due to struct query parameters order.
 * @param {string} uri
 * @returns {Object<string, string | number>}
 */
const parseURI = (uri) => {
  const { pathname, port, hash, query } = parse(uri, true);
  return {
    pathname,
    port,
    hash,
    query
  };
};

const validateURI = (expected, actual) => {
  const values = {
    expected: expected.uri,
    actual: actual.uri
  };

  // Parses URI to perform a correct comparison:
  // - literal comparison of pathname
  // - order-insensitive comparison of query parameters
  const parsedExpected = parseURI(values.expected);
  const parsedActual = parseURI(values.actual);

  // Note the different order of arguments between
  // "validateURI" and "deepEqual".
  const valid = deepEqual(parsedActual, parsedExpected);
  const errors = [];

  if (!valid) {
    errors.push({
      message: `Expected URI '${values.expected}', but got '${values.actual}'.`
    });
  }

  return {
    valid,
    kind: 'text',
    values,
    errors
  };
};

module.exports = { validateURI };
