module.exports = function() {
  this.Given(/^you expect the following HTTP headers:$/, function(
    string,
    callback
  ) {
    this.expected.headers = this.parseHeaders(string);
    return callback();
  });

  return this.When(/^real HTTP headers are following:$/, function(
    string,
    callback
  ) {
    this.real.headers = this.parseHeaders(string);
    return callback();
  });
};
