errors          = require '../errors'
{JsonSchema}   = require './json-schema'
jsonPointer = require 'json-pointer'

{SchemaV4Generator, SchemaV4Properties} = require('../utils/schema-v4-generator')

# Checks data, prepares validator and validates request or response body against given expected data or json schema
# @author Peter Grilli <tully@apiary.io>
class JsonExample extends JsonSchema

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

    @schema = @getSchema @expected

    super @real, @schema

  #@private
  getSchema: (data)->
    properties = new SchemaV4Properties {}
    properties.set keysStrict: false, valuesStrict: false, typesStrict : false

    schemaGenerator = new SchemaV4Generator json: data, properties: properties

    return schemaGenerator.generate()

module.exports = {
  JsonExample
}