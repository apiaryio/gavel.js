errors          = require '../errors'
{JsonSchema}   = require './json-schema'
{SchemaV4Generator, SchemaV4Properties} = require('../utils/schema-v4-generator')
jsonPointer = require 'json-pointer'
type        = require 'is-type'

# Checks data, prepares validator and validates request or response headers against given expected headers or json schema
# @author Peter Grilli <tully@apiary.io>
class HeadersJsonExample extends JsonSchema
  # Construct a HeadersValidator, checks data
  #@param [Object] real data to validate
  #@param [Object] expected expected data
  #@throw {MalformedDataError} when real is not a String or when no schema provided and expected is not a String
  #@throw {SchemaNotJsonParsableError} when given schema is not a json parsable string or valid json
  #@throw {NotEnoughDataError} when at least one of expected data and json schema is not given
  constructor: (@real, @expected) ->
    if not type.object(@real)
      throw new errors.MalformedDataError "Real is not an Object"

    if not type.object(@expected)
      throw new errors.MalformedDataError "Expected is not an Object"

    @expected = @prepareHeaders @expected
    @real =     @prepareHeaders @real

    @schema = @getSchema @expected

    #headers to ignore their values
    if @schema?
      if @schema['properties']?
        for header in ['date', 'expires']
          if @schema['properties'][header]?
            delete @schema['properties'][header]['enum']

    super @real, @schema

  #@private
  prepareHeaders: (headers) ->
    if not type.object(headers)
      return headers

    transformedHeaders = {}

    for key, value of headers
      transformedHeaders[key.toLowerCase()] = value

    return transformedHeaders

  #@private
  getSchema: (data)->
    properties = new SchemaV4Properties {}
    properties.set
      keysStrict: false
      typesStrict : false
      valuesStrict: [
        'content-type'
        'accept'
        'accept-charset'
        'accept-encoding'
        'accept-language'
      ]

    schemaGenerator = new SchemaV4Generator json: data, properties: properties

    return schemaGenerator.generate()


module.exports = {
  HeadersJsonExample
}
