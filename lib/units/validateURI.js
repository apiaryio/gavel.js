const url = require('url');
const deepEqual = require('deep-equal');

const APIARY_URI_TYPE = 'text/vnd.apiary.uri';

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

const validateURI = (expected, real) => {
  const { uri: expectedURI } = expected;
  const { uri: realURI } = real;

  // Parses URI to perform a correct comparison:
  // - literal comparison of pathname
  // - order-insensitive comparison of query parameters
  const parsedExpected = parseURI(expectedURI, true);
  const parsedReal = parseURI(realURI, true);

  // Note the different order of arguments between
  // "validateURI" and "deepEqual".
  const isValid = deepEqual(parsedReal, parsedExpected);
  const errors = [];

  if (!isValid) {
    errors.push({
      message: `Expected "uri" field to equal "${expectedURI}", but got: "${realURI}".`
    });
  }

  return {
    isValid,
    validator: null,
    expectedType: APIARY_URI_TYPE,
    realType: APIARY_URI_TYPE,
    errors
  };
};

module.exports = { validateURI };
