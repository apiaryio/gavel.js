module.exports = function() {
  this.Given(
    /^you define expected HTTP body using the following "([^"]*)":$/,
    function(type, body, callback) {
      if (type === 'textual example') {
        this.expected.body = body;
      } else if (type === 'JSON example') {
        this.expected.body = body;
      } else if (type === 'JSON schema') {
        this.expected.bodySchema = JSON.parse(body);
      }

      return callback();
    }
  );

  return this.When(/^real HTTP body is following:$/, function(body, callback) {
    this.real.body = body;
    return callback();
  });
};
