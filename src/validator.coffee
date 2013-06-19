amanda = require 'amanda'

module.exports.Validator = class Validator

  constructor: ({data, schema}) ->
    if typeof data == 'string'
      @data = JSON.parse data
    else
      @data = data

    @schema = schema

  validate: ->
    return amanda.validate  @data, @schema, (error) ->
      return error

