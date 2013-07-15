errors          = require '../errors'
{JsonValidator}   = require './json-validator'
{StringValidator} = require './string-validator'
{SchemaGenerator, SchemaProperties} = require('../utils/schema-generator')

BodyValidator = class BodyValidator
  #@params
  # real: string
  # expected: string
  # schema: string
  constructor: ({real, expected, schema}) ->
    real = "" if real == null or real == undefined
    expected = "" if expected == null or expected == undefined

    if typeof(real) != 'string'
      outError = new errors.MalformedDataError 'Body validator: provided real data is not string'
      outError['data'] = real
      throw outError

    if (not schema) and typeof(expected) != 'string'
      outError = new errors.MalformedDataError 'Body validator: provided expected data is not string'
      outError['data'] = expected
      throw outError

    validatorType = 'json'

    if schema
      try
        if typeof(schema) != 'object'
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

    else if expected or expected is ''
      try
        @expected = JSON.parse(expected)
        @schema = @getSchema @expected
      catch error
        validatorType = 'string'
        @expected = expected
    else
      throw new errors.NotEnoughDataError "expected data or json schema must be defined"
    if validatorType == 'json'
      try
        @real = JSON.parse(real)
      catch error
        validatorType = 'string'


    if validatorType == 'string'
      @expected = expected
      @real = real

    switch validatorType
      when 'json' then @validator = new JsonValidator data: @real, schema: @schema
      else @validator = new StringValidator string1: @real, string2: @expected

  validate: () ->
    @validator.validate()

  #@private
  getSchema: (data)->
    properties = new SchemaProperties {}
    properties.set keysStrict: false, valuesStrict: false, typesStrict : false

    schemaGenerator = new SchemaGenerator json: data, properties: properties

    return schemaGenerator.generate()

module.exports = {
  BodyValidator
}