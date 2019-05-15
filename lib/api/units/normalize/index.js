const evolve = require('../../utils/evolve');
const normalizeHeaders = require('./normalizeHeaders');

const normalize = evolve({
  headers: normalizeHeaders
});

module.exports = normalize;
