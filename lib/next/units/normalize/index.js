const evolve = require('../../utils/evolve');
const { normalizeStatusCode } = require('./normalizeStatusCode');
const { normalizeHeaders } = require('./normalizeHeaders');

const normalize = evolve({
  statusCode: normalizeStatusCode,
  headers: normalizeHeaders
});

module.exports = { normalize };
