errors          = require '../errors'
{JsonSchema}   = require './json-schema'
{SchemaGenerator, SchemaProperties} = require('../utils/schema-generator')
jsonPointer = require 'json-pointer'

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
    if typeof @real != 'object' 
      throw new errors.MalformedDataError "Real is not an Object"

    if typeof @expected != 'object'
      throw new errors.MalformedDataError "Expected is not an Object"
    
    try
      @expected = @prepareHeaders JSON.parse(JSON.stringify(@expected))
    catch error
      outError = new errors.MalformedDataError "Headers validator - Expected malformed:" + error.message
      outError['data'] = @expected
      throw outError

    try
      @real = @prepareHeaders JSON.parse(JSON.stringify(@real))
    catch error  
      outError = new errors.MalformedDataError "Headers validator - Real malformed:" + error.message
      outError['data'] = @real
      throw outError

    @schema = @getSchema @prepareHeaders @expected
    
    #headers to ignore their values  
    unless @schema == undefined
      unless @schema['properties'] == undefined
        ['date', 'expires'].forEach (header) =>  
          unless @schema['properties'][header] == undefined
            delete @schema['properties'][header]['enum']

    super @real, @schema

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
  HeadersJsonExample
}