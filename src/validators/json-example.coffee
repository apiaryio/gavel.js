errors          = require '../errors'
{JsonSchema}   = require './json-schema'
jsonPointer = require 'json-pointer'

{SchemaGenerator, SchemaProperties} = require('../utils/schema-generator')

# Checks data, prepares validator and validates request or response body against given expected data or json schema
# @author Peter Grilli <tully@apiary.io>
class JsonExample

  # Construct a BodyValidator, checks data and chooses right validator
  #if real data is json parsable and (expected data is json parsable or correct schema is given), then {JsonValidator} is choosen, otherwise {StringValidator} is choosen
  #@option {} [String] real data to validate
  #@option {} [String] expected expected data
  #@option {} [String/Object] schema json schema - if no schema is provided, schema will be generated from expected data, if expected data are json parsable
  #@throw {MalformedDataError} when real is not a String or when no schema provided and expected is not a String
  #@throw {SchemaNotJsonParsableError} when given schema is not a json parsable string or valid json
  #@throw {NotEnoughDataError} when at least one of expected data and json schema is not given
  constructor: (@real, @expected) ->
    
    if typeof(@real) != 'string'
      outError = new errors.MalformedDataError 'JsonExample validator: provided real data is not string'
      outError['data'] = @real
      throw outError

    if typeof(@expected) != 'string'
      outError = new errors.MalformedDataError 'JsonExample validator: provided expected data is not string'
      outError['data'] = @expected
      throw outError

    @expected = JSON.parse(@expected)
    @schema = @getSchema @expected
    
    try
      @real = JSON.parse(real)
    catch error
      validatorType = 'string'

    @validator = new JsonSchema @real, @schema
  
  #calls validation for given data
  #@return [ValidationErrors] {ValidationErrors}
  validate: () ->
    @validator.validate()

  @evaluateOutputToResults: (data) -> 
    results = []
    if data == null
      return results     
    
    #amanda to gavel converter
    if data.length > 0 # expects sanitized Tully pseudo amanda error
      indexes = [0..data.length - 1]
      indexes.forEach (index) ->
        item = data[index]
        console.error
        message =
          pointer: jsonPointer.compile item['property']
          severity: 'error'
          message: item.message
        results.push message
    results
  
  #@private
  getSchema: (data)->
    properties = new SchemaProperties {}
    properties.set keysStrict: false, valuesStrict: false, typesStrict : false

    schemaGenerator = new SchemaGenerator json: data, properties: properties

    return schemaGenerator.generate()

module.exports = {
  JsonExample
}