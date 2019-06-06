/**
 * Normalizes given HTTP message method.
 * @param {string} method
 */
const normalizeMethod = (method) => {
  return method.trim().toUpperCase();
};

module.exports = { normalizeMethod };
