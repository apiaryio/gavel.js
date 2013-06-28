amanda = require 'amanda'
crypto = require('crypto')

{ValidationErrors} = require('./validation-errors')

Validator = class Validator

  constructor: ({data, schema}) ->
    if typeof data == 'string'
      @data = JSON.parse data
    else
      @data = data

    if typeof data == 'string'
      @schema = JSON.parse schema
    else
      @schema = schema

  formatError: (error) ->
    if not error then return null
    errors = {}

    for i in [0..error.length - 1]
      property = error[i]['property']
      #delete error[i]['property']  //dup data
      key = property.join(',')

      if errors[key]
        errors[key].push error[i]
      else
        errors[key] = [error[i]]

    return errors

  validate: ->
    if typeof(@data)  == 'object' and Object.keys(@data).length == 0 and @schema['empty']
      return

    dataHash = @getHash @data
    schemaHash = @getHash @schema

    if @dataHash ==  dataHash and @schemaHash ==  schemaHash
      #console.error 'no need to validate dataHash/schemaHash'
      return @formatedErrors
    else
      @dataHash =  dataHash
      @schemaHash =  schemaHash
      return @validatePrivate()


  #@private
  validatePrivate: ->
    return amanda.validate  @data, @schema, (error) =>

      @errors = new ValidationErrors error
      @amandaErrors = error
      @formatedErrors = @formatError error

      return @formatError error

  #@private
  getHash: (data) ->
    crypto.createHash('md5').update(JSON.stringify(data)).digest('hex')


module.exports = {
  Validator
}
