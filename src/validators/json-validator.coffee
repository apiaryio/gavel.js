amanda = require 'amanda'
crypto = require('crypto')

{ValidationErrors} = require('./validation-errors')
errors          = require '../errors'

sylables = ['a','e','i','o','u']

#options for {Amanda} json validator
json_schema_options =
  singleError: false
  messages:
    'minLength':   (prop, val, validator) -> "The <code>#{prop}</code> property must be at least <code>#{validator}</code> characters long (currently <code>#{val.length}</code> characters long)."
    'maxLength':   (prop, val, validator) -> "The <code>#{prop}</code> property must not exceed <code>#{validator}</code> characters (currently <code>#{val.length}</code> characters long)."
    'length':      (prop, val, validator) -> "The <code>#{prop}</code> property must be exactly <code>#{validator}</code> characters long (currently <code>#{val.length}</code> characters long)."
    'format':      (prop, val, validator) -> "The <code>#{prop}</code> property must be #{if validator[0].toLowerCase() in sylables then 'an' else 'a'} <code>#{validator}</code> (current value is <code>#{JSON.stringify val}</code>)."
    'type':        (prop, val, validator) -> "The <code>#{prop}</code> property must be #{if validator[0].toLowerCase() in sylables then 'an' else 'a'} <code>#{validator}</code> (current value is <code>#{JSON.stringify val}</code>)."
    'except':      (prop, val, validator) -> "The <code>#{prop}</code> property must not be <code>#{val}</code>."
    'minimum':     (prop, val, validator) -> "The minimum value of the <code>#{prop}</code> must be <code>#{validator}</code> (current value is <code>#{JSON.stringify val}</code>)."
    'maximum':     (prop, val, validator) -> "The maximum value of the <code>#{prop}</code> must be <code>#{validator}</code> (current value is <code>#{JSON.stringify val}</code>)."
    'pattern':     (prop, val, validator) -> "The <code>#{prop}</code> value (<code>#{val}</code>) does not match the <code>#{validator}</code> pattern."
    'maxItems':    (prop, val, validator) -> "The <code>#{prop}</code> property must not contain more than <code>#{validator}</code> items (currently contains <code>#{val.length}</code> items)."
    'minItems':    (prop, val, validator) -> "The <code>#{prop}</code> property must contain at least <code>#{validator}</code> items (currently contains <code>#{val.length}</code> items)."
    'divisibleBy': (prop, val, validator) -> "The <code>#{prop}</code> property is not divisible by <code>#{validator}</code> (current value is <code>#{JSON.stringify val}</code>)."
    'uniqueItems': (prop, val, validator) -> "All items in the <code>#{prop}</code> property must be unique."

# Validates given data against given schema
# @author Peter Grilli <tully@apiary.io>
class JsonValidator
  # Construct a JsonValidator and checks given data
  #@param {} [Object] data to validate
  #@param {} [Object] json schema
  #@throw {DataNotJsonParsableError} when given data or schema is not json parsable object
  constructor: (@data, @schema) ->
    try
      @data = JSON.parse(JSON.stringify(@data))
    catch error
      outError = new errors.DataNotJsonParsableError 'JSON validator: body: ' + error.message
      outError['data'] = @data
      throw outError

    try
      @schema = JSON.parse(JSON.stringify(schema))
    catch error
      outError = new errors.SchemaNotJsonParsableError 'JSON validator: schema: ' + error.message
      outError['schema'] = @schema
      throw outError

  #Validates given data against given schema
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
  JsonValidator
}
