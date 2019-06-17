const evolve = require('../../utils/evolve');
const otherwise = require('../../utils/otherwise');

const coercionMap = {
  method: otherwise(''),
  uri: otherwise(''),
  headers: otherwise({})
};

// Coercion is strict by default, meaning it would populate
// all the keys illegible for coercion on the given object,
// even if those keys are missing.
const coerce = evolve(coercionMap, { strict: true });

// There is also a weak variant of coercion that operates
// only on the present keys in the given object.
// This is used for coercing expected HTTP message, for example.
const coerceWeak = evolve(coercionMap);

module.exports = {
  coerce,
  coerceWeak
};
