errors          = require '../errors'
{JsonValidator}   = require './json-validator'
{SchemaGenerator, SchemaProperties} = require('../utils/schema-generator')

# Checks data, prepares validator and validates request or response headers against given expected headers or json schema
# @author Peter Grilli <tully@apiary.io>
class HeadersValidator
  # Construct a HeadersValidator, checks data
  #@option {} [Object] real data to validate
  #@option {} [Object] expected expected data
  #@option {} [String/Object] schema json schema - if no schema is provided, schema will be generated from expected data, if expected data are json parsable
  #@throw {MalformedDataError} when real is not a String or when no schema provided and expected is not a String
  #@throw {SchemaNotJsonParsableError} when given schema is not a json parsable string or valid json
  #@throw {NotEnoughDataError} when at least one of expected data and json schema is not given
  constructor: ({real, expected, schema}) -> 
    expected = {} if expected == null or expected == undefined 
    real = {} if real == null or real == undefined 
    if schema
      try
        if not (schema instanceof Object)
          try
            @schema = JSON.parse schema

          catch error
            throw new Error 'Body: schema is not object or parseable JSON'
        else if Object.keys(schema).length == 0
          @schema = null
        else
          @schema = JSON.parse(JSON.stringify(schema))

      catch error
        outError = new errors.SchemaNotJsonParsableError error.message
        outError['schema'] = schema
        throw outError
    else if expected
      try
        @expected = JSON.parse(JSON.stringify(expected))
        @schema = @getSchema @prepareHeaders @expected
      catch error
        outError = new errors.MalformedDataError "Headers validator - Expected malformed:" + error.message
        outError['data'] = expected
        throw outError
    else
      throw new errors.NotEnoughDataError "Headers validator: expected data or json schema must be defined"

    try
      @real = @prepareHeaders JSON.parse(JSON.stringify(real))
    catch error


      outError = new errors.MalformedDataError "Headers validator - Real malformed:" + error.message
      outError['data'] = real
      throw outError

    @validator = new JsonValidator data: @real, schema: @schema

  #calls validation for given data
  validate: () ->
    @validator.validate()

  #@private
  prepareHeaders: (headers) ->
    if not (headers instanceof Object)
      return headers

    transformedHeaders = {}

    for key, value of headers
      transformedHeaders[key.toLowerCase()] = value

    return transformedHeaders

  #@private
  getSchema: (data)->
    properties = new SchemaProperties {}
    properties.set keysStrict: false, valuesStrict: true, typesStrict : false

    schemaGenerator = new SchemaGenerator json: data, properties: properties

    return schemaGenerator.generate()


module.exports = {
  HeadersValidator
}