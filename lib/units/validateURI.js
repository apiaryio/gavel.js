const deepEqual = require('deep-equal');

const APIARY_URI_TYPE = 'text/vnd.apiary.uri';

/**
 * Parses a given query string into an Object.
 * @param {string} queryString
 * @returns {Object<string, string | string[]>}
 */
const parseQueryString = (queryString) => {
  if (!queryString) {
    return {};
  }

  return queryString.split('&').reduce((acc, paramString) => {
    const [paramName, paramValue] = paramString.split('=');
    const nextValue = Object.prototype.hasOwnProperty.call(acc, paramName)
      ? [].concat(acc[paramName], paramValue)
      : paramValue;

    return {
      ...acc,
      [paramName]: nextValue
    };
  }, {});
};

/**
 * @param {string} uri
 */
const parseURI = (uri) => {
  const parsed = /(\w+)(\?(.+))?/.exec(uri) || [];
  const hostname = parsed[1];
  const queryString = parsed[3];

  return {
    hostname,
    query: parseQueryString(queryString)
  };
};

const validateURI = (expected, real) => {
  const { uri: expectedURI } = expected;
  const { uri: realURI } = real;

  // Parses URI into Objects to deal with
  // the order of query parameters.
  const parsedExpected = parseURI(expectedURI);
  const parsedReal = parseURI(realURI);

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
