assert = require('chai').assert
amanda = require 'amanda'
gavel = require '../../../src/gavel'
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

  Given /^you express expected data by the following "([^"]*)" example:$/, (type, string, callback) ->
    callback()
  Given /^you have the following "([^"]*)" real data:$/, (type, string, callback) ->
    callback()  
  When /^you perform validation on the HTTP component$/, (callback) ->
    callback()
  Then /^validator "([^"]*)" is used for validation$/, (validator, callback) ->
    callback()
  Then /^validation key "([^"]*)" looks like:$/, (data, string, callback) ->
    callback()
  Then /^each result entry must contain "([^"]*)" key$/, (key, callback) ->

module.exports = validatorStepDefs