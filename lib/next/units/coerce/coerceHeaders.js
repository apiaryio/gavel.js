// Coerces given headers to an empty Object in case not present.
// Conceptually, diff between missing headers and empty headers
// should be treated the same.
const coerceHeaders = (headers) => {
  return headers || {};
};

module.exports = { coerceHeaders };
