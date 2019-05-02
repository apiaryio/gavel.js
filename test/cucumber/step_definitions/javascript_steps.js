module.exports = function() {
  this.Given(/^you define the following "([^"]*)" variable:$/, function(
    arg1,
    string,
    callback
  ) {
    this.codeBuffer += string + '\n';
    return callback();
  });

  this.Given(/^you define following "([^"]*)" object:$/, function(
    objectName,
    string,
    callback
  ) {
    this.codeBuffer += string + '\n';
    return callback();
  });

  this.Given(/^you add expected "([^"]*)" to real "([^"]*)":$/, function(
    arg1,
    arg2,
    string,
    callback
  ) {
    this.codeBuffer += string + '\n';
    return callback();
  });

  this.Given(/^prepare result variable:$/, function(string, callback) {
    this.codeBuffer += string + '\n';
    return callback();
  });

  this.Then(/^"([^"]*)" variable will contain:$/, function(
    varName,
    string,
    callback
  ) {
    this.codeBuffer += varName + '\n';
    const expected = string;
    return this.expectBlockEval(this.codeBuffer, expected, callback);
  });

  this.When(/^you call:$/, function(string, callback) {
    this.codeBuffer += string + '\n';
    return callback();
  });

  return this.Then(/^it will return:$/, function(expected, callback) {
    return this.expectBlockEval(this.codeBuffer, expected, callback);
  });
};
