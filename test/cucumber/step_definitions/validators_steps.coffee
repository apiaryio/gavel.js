assert = require('chai').assert
amanda = require 'amanda'
gavel = require '../../../src/gavel'
{assert} = require 'chai'
_ = require 'lodash'

json_schema_options =
  singleError: false

validatorStepDefs = () ->
  Given = When = Then = @.defineStep

  When /^you perform a failing validation on any validatable HTTP component$/, (callback) ->
    json1 = '{"a": "b"}'
    json2 = '{"c": "d"}'
    
    @component = 'body'

    @real =
      headers:
        'content-type': 'application/json'
      body: json1

    @expected =
      headers:
        'content-type': 'application/json'
      body: json2

    @validate (error, result) =>
      callback.fail "Got error during validation:\n" + error if error
      @results = JSON.parse JSON.stringify result
      
      @isValid (error, result) ->
        callback.fail error if error
        @booleanResult = result
        callback()

  Then /^the validator output for the HTTP component looks like the following JSON:$/, (expectedJson, callback) ->    
    expected = JSON.parse expectedJson
    real = @results[@component]
    if not _.isEqual real, expected
      callback.fail "Not matched! Expected:" + "\n" + \
                    JSON.stringify(expected, null, 2) + "\n" + \
                    "But got:" + "\n" + \
                    JSON.stringify(real, null, 2)
    callback()

  Then /^validated HTTP component is considered invalid$/, (callback) ->
    assert.isFalse @booleanResult
    callback()
  
  Then /^the validator output for the HTTP component is valid against "([^"]*)" model JSON schema:$/, (model, schema, callback) ->
    amanda.validate @results[@component], JSON.parse(schema), (error) ->
      if error
        if not Object.keys(error).length == 0
          callback.fail "Expected no validation errors on schema but got:\n" +
                    JSON.stringify(error, null, 2)
      callback()

  Then /^each result entry under "([^"]*)" key must contain "([^"]*)" key$/, (key1, key2, callback) ->
    error = @results[@component]
    if error == undefined
      callback.fail 'Validation result for "' + \ 
        @component + \
        '" is undefined. Validations: ' + \
        JSON.stringify @results, null, 2

    error[key1].forEach (error) ->
      assert.include Object.keys(error), key2
    callback()

  Then /^the output JSON contains key "([^"]*)" with one of the following values:$/, (key, table, callback) ->
    error = @results[@component]
    
    validators = [].concat.apply [], table.raw()
    
    assert.include validators, error[key]
    callback()

  Given /^you want validate "([^"]*)" HTTP component$/, (component, callback) ->
    @component = component
    callback()

  Given /^you express expected data by the following "([^"]*)" example:$/, (type, data, callback) ->
    if type == 'application/schema+json'
      @expected['bodySchema'] = data
    else if type == 'application/vnd.apiary.http-headers+json'
      @expected[@component] = JSON.parse data
    else      
      @expected[@component] = data
    
    @expectedType = type
    callback()

  Given /^you have the following "([^"]*)" real data:$/, (type, data, callback) ->
    if type == 'application/vnd.apiary.http-headers+json'
      @real[@component] = JSON.parse data
    else
      @real[@component] = data

    @realType = type
    callback()  

  When /^you perform validation on the HTTP component$/, (callback) ->
    @validate (error, result) =>
      if error
        callback.fail "Error during validation: " + error

      @results = result
      @componentResults = @results[@component]
      callback()
  
  Then /^validator "([^"]*)" is used for validation$/, (validator, callback) ->
    usedValidator = @componentResults['validator']
    if validator != usedValidator
      callback.fail "Used validator '" + usedValidator + "'" + \
        " instead of '" + validator + "'. Got validation results: " + \
        JSON.stringify(@results, null, 2)
    callback()
  
  Then /^validation key "([^"]*)" looks like the following "([^"]*)":$/, (key, type, expected, callback) ->
    real = @componentResults[key]
    if type == "JSON"
      expected = JSON.parse expected
    else if type == "text"
      # FIXME investigate how does cucumber docstrings handle 
      # newlines and remove trim and remove this hack
      expected = expected + "\n"

    if type == "JSON"
      if not _.isEqual expected, real
        callback.fail "Not matched! Expected:" + "\n" + \
                      @inspect(expected) + "\n" + \
                      "But got:" + "\n" + \
                      @inspect(real) + "\n" + \
                      "End"
    else if type == "text"
      assert.equal expected, real    
    callback()
  
  Then /^each result entry must contain "([^"]*)" key$/, (key, callback) ->
    @componentResults['results'].forEach (error) ->
      assert.include Object.keys(error), key
    callback()

module.exports = validatorStepDefs