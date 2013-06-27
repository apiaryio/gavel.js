headersStepDefs = () ->
  Given = When = Then = @.defineStep
  
  Given /^expected following HTTP headers:$/, (string, callback) ->
    @.hit.response.defined.headers = parseHeaders(string)
    callback()
  
  When /^following real HTTP headers:$/, (string, callback) ->
    @.hit.response.realPayload.headers = parseHeaders(string)
    callback()

  parseHeaders = (headersString) ->
    lines = headersString.split('\n')
    headers = {}
    for line in lines
      parts = line.split(":")
      key = parts.shift()
      headers[key.toLowerCase()] = parts.join(":").trim()
    headers

module.exports = headersStepDefs
