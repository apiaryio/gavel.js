assert = require('chai').assert
amanda = require
gavel = require '../../../src/gavel'
_ = require 'lodash'

json_schema_options =
  singleError: false

validatorStepDefs = () ->
  Given = When = Then = @.defineStep

  When /^you perform a failing validation on any validatable HTTP component$/, (callback) ->
    json1 = '{}'
    json2 = '{"a": "b"}'
    
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
      callback.fail error if error
      @result = JSON.parse JSON.stringify result
      
      @isValid (error, result) ->
        callback.fail error if error
        @booleanResult = result
        callback()

  Then /^the validator output for the HTTP component looks like the following JSON:$/, (expectedJson, callback) ->    
    expected = JSON.parse expectedJson
    real = @result[@component]
    if not _.isEqual real, expected
      callback.fail "Not matched! Expected:" + "\n" + \
                    JSON.stringify(expected, null, 2) + "\n" + \
                    "But got:" + "\n" + \
                    JSON.stringify(real, null, 2)
    callback()

  Then /^validated HTTP component is considered invalid$/, (json, callback) ->
    assert.isTrue @booleanResult
    callback()
  
  Then /^the validator output for the HTTP component is valid against "([^"]*)" model JSON schema:$/, (model, schema, callback) ->
    amanda.validate @results[@component], schema, json_schema_optiions, (error) ->
      if not Object.keys(error).length == 0
        callback.fail "Expected no validation errors on schema but got:\n" +
                      JSON.stringify(error, null, 2)
      callback()

  Then /^each result entry under "([^"]*)" key must contain "([^"]*)" key$/, (key1, key2, callback) ->
    error = @results[@component]
    Object.keys(error['results']).forEach (error) ->
      assert.include Object.keys(error[key1]), key2
    callback()

  Then /^the output JSON contains key "([^"]*)" with one of the following values:$/, (key, table, callback) ->
    error = @results[@component]
    assert.include table[0], error[key]
    callback()

module.exports = validatorStepDefs