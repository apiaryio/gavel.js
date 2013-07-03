amanda = require 'amanda'
crypto = require('crypto')

{ValidationErrors} = require('./validation-errors')
errors          = require '../errors'

JsonValidator = class JsonValidator

  constructor: ({data, schema}) ->
    try
      if typeof(data) != 'object'
        throw new Error 'input data is not object'

      @data = JSON.parse(JSON.stringify(data))
    catch error
      outError = new errors.DataNotJsonParsableError 'JSON validator: ' + error.message
      outError['data'] = data
      throw outError

    try
      if typeof(schema) != 'object'
        throw new Error 'input schema is not object'

      @schema = JSON.parse(JSON.stringify(schema))
    catch error
      outError = new errors.SchemaNotJsonParsableError 'JSON validator: ' + error.message
      outError['schema'] = schema
      throw outError

  validate: ->
    if typeof(@data)  == 'object' and Object.keys(@data).length == 0 and @schema['empty']
      return

    dataHash = @getHash @data
    schemaHash = @getHash @schema

    if @dataHash ==  dataHash and @schemaHash ==  schemaHash
      return @errors
    else
      @dataHash =  dataHash
      @schemaHash =  schemaHash
    return @validatePrivate()



  #@private
  validatePrivate: ->
    return amanda.validate  @data, @schema, {singleError: false}, (error) =>
      return @errors = new ValidationErrors error

  #@private
  getHash: (data) ->
    crypto.createHash('md5').update(JSON.stringify(data)).digest('hex')


module.exports = {
  JsonValidator
}
