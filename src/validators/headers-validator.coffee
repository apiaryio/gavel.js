errors          = require '../errors'
{JsonValidator}   = require './json-validator'
{SchemaGenerator, SchemaProperties} = require('../utils/schema-generator')

HeadersValidator = class HeadersValidator
  #@params
  # real: hash
  # expected: hash
  # schema: string
  constructor: ({real, expected, schema}) ->
    if schema
      try
        if typeof(schema) != 'object'
          throw new Error 'schema is not object'

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
        @schema = @getSchema @expected
      catch error
        outError = new errors.MalformedDataError error.message
        outError['data'] = expected
        throw outError
    else
      throw new errors.NotEnoughDataError "expected data or json schema must be defined"

    try
      @real = JSON.parse(JSON.stringify(real))
    catch error
      outError = new errors.MalformedDataError error.message
      outError['data'] = real
      throw outError

    @validator = new JsonValidator data: @real, schema: @schema

  validate: () ->
    @validator.validate()

  #@private
  getSchema: (data)->
    properties = new SchemaProperties {}
    properties.set keysStrict: false, valuesStrict: true, typesStrict : false

    schemaGenerator = new SchemaGenerator json: data, properties: properties

    return schemaGenerator.generate()


module.exports = {
  HeadersValidator
}