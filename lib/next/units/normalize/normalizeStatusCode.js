function normalizeStatusCode(value) {
  return value == null ? '' : String(value).trim();
}

module.exports = { normalizeStatusCode };
