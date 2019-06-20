module.exports = function() {
  this.Given(/^you expect HTTP message method "([^"]*)"$/, function(
    method,
    callback
  ) {
    this.expected.method = method;
    return callback();
  });

  return this.When(/^real HTTP message method is "([^"]*)"$/, function(
    method,
    callback
  ) {
    this.real.method = method;
    return callback();
  });
};
