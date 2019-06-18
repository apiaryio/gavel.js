const normalizeStringValue = (value) => {
  return value.toLowerCase();
};

/**
 * Normalizes given headers.
 * @param {Object<string, string>} headers
 * @returns {Object<string, string>}
 */
const normalizeHeaders = (headers) => {
  const headersType = typeof headers;
  const isHeadersNull = headers == null;

  if (isHeadersNull || headersType !== 'object') {
    throw new Error(
      `Can't validate: expected "headers" to be an Object, but got: ${
        isHeadersNull ? 'null' : headersType
      }.`
    );
  }

  return Object.keys(headers).reduce(
    (normalizedHeaders, name) => ({
      ...normalizedHeaders,
      [name.toLowerCase()]:
        typeof headers[name] === 'string'
          ? normalizeStringValue(headers[name])
          : headers[name]
    }),
    {}
  );
};

module.exports = { normalizeHeaders };
