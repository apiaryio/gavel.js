gavel = require '../../../src/gavel'
prettyjson = require 'prettyjson'
_ = require 'lodash'

modelStepDefs = () ->
  Given = When = Then = @.defineStep

  # TODO consider refactoring for for better acceptace testing to separated steps 
  # i.e. do not use http parsing, use separate steps for body, headers, code, etc...
  When /^you have the following real HTTP request:$/, (requestString, callback) ->
    @model.request = @parseHttp 'request', requestString
    callback()

  When /^you have the following real HTTP response:$/, (responseString, callback) ->
    @model.response = @parseHttp 'response', responseString
    callback()

  Then /^"([^"]*)" JSON representation will look like this:$/, (objectTypeString, string, callback) ->
    expectedObject = JSON.parse(string)

    if objectTypeString == 'HTTP Request'
      klass = 'HttpRequest'
      data = @model.request
    else if objectTypeString == 'HTTP Response'
      klass = 'HttpResponse'
      data = @model.response
    else if objectTypeString == 'Expected HTTP Request'
      klass = 'ExpectedHttpRequest'
      data = @expected  
    else if objectTypeString == 'Expected HTTP Response'
      klass = 'ExpectedHttpResponse'
      data = @expected
 
    instance = new gavel[klass] data

    jsonizedInstance = JSON.parse(JSON.stringify(instance))
     
    unless _.isEqual expectedObject, jsonizedInstance
       callback.fail "Objects are not equal: " +
         "\nexpected: \n" + 
         JSON.stringify(expectedObject, null, 2) +
         "\njsonized instance: \n" +
         JSON.stringify(jsonizedInstance, null, 2)
    
    callback()

module.exports = modelStepDefs