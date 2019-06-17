/**
 * Accepts a fallback value and returns an ensuring function
 * that uses the fallback value in case real one is not provided.
 */
const otherwise = (fallbackValue) => (realValue) => {
  return realValue || fallbackValue;
};

module.exports = otherwise;
