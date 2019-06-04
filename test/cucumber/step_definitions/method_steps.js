module.exports = function() {
  this.Given(
    /^you expect HTTP message method "([^"]*)"$/,
    (method, callback) => {
      this.expected.method = method;
      return callback();
    }
  );

  return this.When(
    /^real HTTP message method is "([^"]*)"$/,
    (method, callback) => {
      this.real.message = method;
      return callback();
    }
  );
};
