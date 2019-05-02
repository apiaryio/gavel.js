module.exports = function() {
  this.Given(/^you expect HTTP status code "([^"]*)"$/, function(
    code,
    callback
  ) {
    this.expected.statusCode = code;
    return callback();
  });

  return this.When(/^real status code is "([^"]*)"$/, function(code, callback) {
    this.real.statusCode = code;
    return callback();
  });
};
