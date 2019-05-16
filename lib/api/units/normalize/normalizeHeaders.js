const normalizeStringValue = (value) => {
  return value.toLowerCase().trim();
};

/**
 * Normalizes the given headers.
 * @param {Object} headers
 * @returns {Object}
 */
const normalizeHeaders = (headers) => {
  if (!headers) {
    return {};
  }

  const headersType = typeof headers;

  if (headersType === null || headersType !== 'object') {
    throw new Error(
      `Can't validate: expected "headers" to be an Object, but got: ${headersType}.`
    );
  }

  return Object.keys(headers).reduce(
    (acc, name) => ({
      ...acc,
      [name.toLowerCase()]:
        typeof headers[name] === 'string'
          ? normalizeStringValue(headers[name])
          : headers[name]
    }),
    {}
  );
};

module.exports = { normalizeHeaders };
