// Note that Json Schema now uses "jju" for JSON parsing
// which allows certain JSON abnormalities (i.e. trailing commas, single quotes).
// Account on that to produce an invalid JSON.
module.exports = `{"111!invalid string ... issue":malformed''}`;
