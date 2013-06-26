amanda = require 'amanda'
crypto = require('crypto')

{Errors} = require('./errors')

Validator = class Validator

  constructor: ({data, schema}) ->
    if typeof data == 'string'
      @data = JSON.parse data
    else
      @data = data

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

    if @dataHash == @setDataHash @data
      #console.error 'no need to validate'
      return @formatedErrors

    return amanda.validate  @data, @schema, (error) =>
      @errors = new Errors error
      @amandaErrors = error
      @formatedErrors = @formatError error
      return @formatError error

  #@private
  setDataHash: (data) ->
    @dataHash = crypto.createHash('md5').update(JSON.stringify(data)).digest('hex')


module.exports = {
  Validator
}
