module.exports = function() {
  this.Given(/^you expect HTTP message URI "([^"]*)"$/, function(
    uri,
    callback
  ) {
    this.expected.uri = uri;
    return callback();
  });

  return this.When(/^real HTTP message URI is "([^"]*)"$/, function(
    uri,
    callback
  ) {
    this.real.uri = uri;
    return callback();
  });
};
