const { parse } = require('jju/lib/parse');

const parseJson = (json, revivew) => {
  try {
    return parse(json, revivew);
  } catch (error) {
    throw error;
  }
};

module.exports = parseJson;
