tv4 = require 'tv4'
crypto = require('crypto')
jsonPointer = require 'json-pointer'

metaSchema = require '../meta-schema'

{ValidationErrors} = require('./validation-errors')
errors          = require '../errors'

sylables = ['a','e','i','o','u']

# Validates given data against given schema
# @author Peter Grilli <tully@apiary.io>
class JsonSchema
  
  # Construct a JsonValidator and checks given data
  #@param {} [Object|String] data to validate
  #@param {} [Object|String] json schema
  #@throw {DataNotJsonParsableError} when given data or schema is not json parsable object
  constructor: (@data, @schema) ->
    if typeof @data == 'string'
      try
        @data = JSON.parse(@data)
      catch error
        outError = new errors.DataNotJsonParsableError 'JSON validator: body: ' + error.message
        outError['data'] = @data
        throw outError
    
    if typeof @schema == 'string'
      try
        @schema = JSON.parse(schema)
      catch error
        outError = new errors.SchemaNotJsonParsableError 'JSON validator: schema: ' + error.message
        outError['schema'] = @schema
        throw outError

    @validateSchema()

  # Validates given schema against metaschema
  validateSchema: () ->
    if metaSchema.$schema
      tv4.addSchema "", metaSchema
      tv4.addSchema metaSchema.$schema, metaSchema

    if not tv4.validate @schema, metaSchema
      throw new errors.JsonSchemaNotValid 'JSON schema is not valid! ' + tv4.error.message + ' at path "' + tv4.error.dataPath + '"'

  # Validates given data against given schema
  #@return [ValidationErrors]
  validate: ->
    if ((@data instanceof Object) and Object.keys(@data).length == 0) or ((@data instanceof Object) and @schema['empty'])
      @output = {
        "length":0,
        "errorMessages":{
        }
      }
      return new ValidationErrors @output

    dataHash = @getHash @data
    schemaHash = @getHash @schema

    if @dataHash ==  dataHash and @schemaHash ==  schemaHash
      return @output
    else
      @dataHash =  dataHash
      @schemaHash =  schemaHash
    return @output = @validatePrivate()

  evaluateOutputToResults:  (data)->
    if not data
      data = @output

    if not data
      return []

    results = []

    #TV4 to gavel converter
    if data.length > 0
      indexes = [0..data.length - 1]
      indexes.forEach (index) ->
        item = data[index]
        pointer = item['property'] or []
        message =
          pointer: jsonPointer.compile pointer
          severity: 'error'
          message: item.message
        results.push message

    return results

  #@private
  validatePrivate: =>
    result = tv4.validateMultiple @data, @schema
    localError =
      property: []
      length: result.errors.length
      errorMessages: {}

    for error, index in result?.errors
      localError[index] =
        "property":[ if error.params.key then error.params.key else error.dataPath ]
        "attributeValue":true
        "message": error.message
        "validatorName":"error"
        "pointer": error.schemaPath
    return @errors = new ValidationErrors localError

  #@private
  getHash: (data) ->
    crypto.createHash('md5').update(JSON.stringify(data)).digest('hex')


module.exports = {
  JsonSchema
}
