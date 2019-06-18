/**
 * Normalizes given status code.
 * @param {string} value
 * @returns {string}
 */
function normalizeStatusCode(value) {
  return value == null ? '' : String(value).trim();
}

module.exports = { normalizeStatusCode };
