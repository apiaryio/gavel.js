/**
 * Normalizes given method.
 * @param {string} method
 * @returns {string}
 */
const normalizeMethod = (method) => {
  return method.trim().toUpperCase();
};

module.exports = { normalizeMethod };
