errors          = require '../errors'
{JsonValidator}   = require './json-validator'
{SchemaGenerator, SchemaProperties} = require('../utils/schema-generator')

class HeadersValidator
  #@params
  # real: hash
  # expected: hash
  # schema: string
  constructor: ({real, expected, schema}) -> 
    expected = {} if expected == null or expected == undefined 
    real = {} if real == null or real == undefined 
    if schema
      try
        if typeof(schema) != 'object'
          throw new Error 'Headers validator: schema is not object'

        if Object.keys(schema).length == 0
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

  validate: () ->
    @validator.validate()

  #@private
  prepareHeaders: (headers) ->
    if typeof(headers) != 'object'
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