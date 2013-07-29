headersStepDefs = () ->
  Given = When = Then = @.defineStep
  
  Given /^you expect the following HTTP headers:$/, (string, callback) ->
    @expected.headers = @parseHeaders(string)
    callback()
  
  When /^real HTTP headers are following:$/, (string, callback) ->
    @real.headers = @parseHeaders(string)
    callback()


module.exports = headersStepDefs
