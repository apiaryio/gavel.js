module.exports = function() {
  this.Given(/^you expect HTTP message URI "([^"]*)"$/, (uri, callback) => {
    this.expected.uri = uri;
    return callback();
  });

  return this.When(/^real HTTP message URI is "([^"]*)"$/, (uri, callback) => {
    this.real.uri = uri;
    return callback();
  });
};
