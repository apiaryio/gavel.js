const validateHeaders = require('./units/validateHeaders');
const { validateBody } = require('./units/validateBody');

function validateRequest(real, expected) {
  return {
    headers: validateHeaders(real, expected),
    body: validateBody(real, expected)
  };
}

module.exports = validateRequest;
