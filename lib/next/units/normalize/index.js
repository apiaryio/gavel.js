const evolve = require('../../utils/evolve');
const { normalizeMethod } = require('./normalizeMethod');
const { normalizeStatusCode } = require('./normalizeStatusCode');
const { normalizeHeaders } = require('./normalizeHeaders');

const normalize = evolve({
  method: normalizeMethod,
  statusCode: normalizeStatusCode,
  headers: normalizeHeaders
});

module.exports = { normalize };
