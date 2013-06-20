amanda = require 'amanda'

module.exports.Validator = class Validator

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
      errors[property] = error[i]

    return errors

  validate: ->
    if typeof(@data)  == 'object' and Object.keys(@data).length == 0 and @schema['empty']
      return
    return amanda.validate  @data, @schema, (error) =>
      return @formatError error

