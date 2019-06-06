const otherwise = (fallbackValue) => (realValue) => {
  return realValue || fallbackValue;
};

module.exports = otherwise;
