const evolve = require('../../utils/evolve');
const { coerceHeaders } = require('./coerceHeaders');

const coercionMap = {
  headers: coerceHeaders
};

// Coercion uses strict evolve to ensure the properties
// set in expected schema are set on the result object,
// even if not present in data object. This is what
// coercion is about, in the end.
const coerce = evolve(coercionMap, { strict: true });
const coerceWeak = evolve(coercionMap);

module.exports = { coerce, coerceWeak };
