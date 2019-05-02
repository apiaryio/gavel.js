function isset(value) {
  return typeof value !== 'undefined' && value !== null;
}

module.exports = isset;
