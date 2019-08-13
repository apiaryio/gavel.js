const { parse } = require('jju/lib/parse');

const parseJson = (json, strict = false, revivew) => {
  try {
    // Strict parsing uses native JSON parsing and implies
    // a given JSON is valid according to the spec.
    //
    // Non-strict parsing uses "jju" enhanced parsing
    // that allows trailing commas and potential other transformations.
    const jsonParser = strict ? JSON.parse : parse;
    return jsonParser(json, revivew);
  } catch (error) {
    throw error;
  }
};

module.exports = parseJson;
