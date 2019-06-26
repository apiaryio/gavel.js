const url = require('url');
const deepEqual = require('deep-equal');

/**
 * Parses the given URI and returns the properties
 * elligible for comparison. Leaves out raw properties like "path"
 * that cannot be compared due to struct query parameters order.
 * @param {string} uri
 * @returns {Object<string, string | number>}
 */
const parseURI = (uri) => {
  const { pathname, port, hash, query } = url.parse(uri, true);
  return {
    pathname,
    port,
    hash,
    query
  };
};

const validateURI = (expected, actual) => {
  const { uri: expectedURI } = expected;
  const { uri: actualURI } = actual;

  // Parses URI to perform a correct comparison:
  // - literal comparison of pathname
  // - order-insensitive comparison of query parameters
  const parsedExpected = parseURI(expectedURI);
  const parsedActual = parseURI(actualURI);

  // Note the different order of arguments between
  // "validateURI" and "deepEqual".
  const valid = deepEqual(parsedActual, parsedExpected);
  const errors = [];

  if (!valid) {
    errors.push({
      message: `Expected "uri" field to equal "${expectedURI}", but got: "${actualURI}".`,
      values: {
        expected: expectedURI,
        actual: actualURI
      }
    });
  }

  return {
    valid,
    kind: 'text',
    errors
  };
};

module.exports = { validateURI };
