amanda = require 'amanda'
crypto = require('crypto')
jsonPointer = require 'json-pointer'

{ValidationErrors} = require('./validation-errors')
errors          = require '../errors'

sylables = ['a','e','i','o','u']

#options for {Amanda} json validator
json_schema_options =
  singleError: false
  messages:
    'minLength':   (prop, val, validator) -> "The #{prop} property must be at least #{validator} characters long (currently #{val.length} characters long)."
    'maxLength':   (prop, val, validator) -> "The #{prop} property must not exceed #{validator} characters (currently #{val.length} characters long)."
    'length':      (prop, val, validator) -> "The #{prop} property must be exactly #{validator} characters long (currently #{val.length} characters long)."
    'format':      (prop, val, validator) -> "The #{prop} property must be #{if validator[0].toLowerCase() in sylables then 'an' else 'a'} #{validator} (current value is #{JSON.stringify val})."
    'type':        (prop, val, validator) -> "The #{prop} property must be #{if validator[0].toLowerCase() in sylables then 'an' else 'a'} #{validator} (current value is #{JSON.stringify val})."
    'except':      (prop, val, validator) -> "The #{prop} property must not be #{val}."
    'minimum':     (prop, val, validator) -> "The minimum value of the #{prop} must be #{validator} (current value is #{JSON.stringify val})."
    'maximum':     (prop, val, validator) -> "The maximum value of the #{prop} must be #{validator} (current value is #{JSON.stringify val})."
    'pattern':     (prop, val, validator) -> "The #{prop} value (#{val}) does not match the #{validator} pattern."
    'maxItems':    (prop, val, validator) -> "The #{prop} property must not contain more than #{validator} items (currently contains #{val.length} items)."
    'minItems':    (prop, val, validator) -> "The #{prop} property must contain at least #{validator} items (currently contains #{val.length} items)."
    'divisibleBy': (prop, val, validator) -> "The #{prop} property is not divisible by #{validator} (current value is #{JSON.stringify val})."
    'uniqueItems': (prop, val, validator) -> "All items in the #{prop} property must be unique."

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

  # Validates given data against given schema
  #@return [ValidationErrors]
  validate: ->
    if ((@data instanceof Object) and Object.keys(@data).length == 0) or ((@data instanceof Object) and @schema['empty'])
      error = {
        "length":0,
        "errorMessages":{
        }
      }
      return new ValidationErrors error

    dataHash = @getHash @data
    schemaHash = @getHash @schema

    if @dataHash ==  dataHash and @schemaHash ==  schemaHash
      return @errors
    else
      @dataHash =  dataHash
      @schemaHash =  schemaHash
    return @validatePrivate()

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
  validatePrivate: ->
    try
      return amanda.validate  @data, @schema, json_schema_options, (error) =>
        return @errors = new ValidationErrors error
    catch error
      error = {
        "0":{
          "property":[],
          "attributeValue":true,
          "message":"Validator internal error: #{error.message}",
          "validatorName":"error",
        },
        "length":1,
        "errorMessages":{
        }

      }
      return @errors = new ValidationErrors error


  #@private
  getHash: (data) ->
    crypto.createHash('md5').update(JSON.stringify(data)).digest('hex')


module.exports = {
  JsonSchema
}
