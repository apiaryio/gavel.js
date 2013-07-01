amanda = require 'amanda'
crypto = require('crypto')

{JsonValidator}     = require('./validators/json')
{TextValidator}     = require('./validators/string')

Validator = class Validator
#  @params:
#    data: {real: json, expected: json_schema}/{real: text, expected: text2}
#    type: ['string', 'json']

  constructor: ({data, type}) ->
    switch type
      when 'json' then @validator =  new JsonValidator data: data.real, schema: data.expected
      else
        throw new Error 'type is not supported'

  validate: () ->

    validationResult =  @validator.validate()
    @errors         = @validator.errors
    #tmp splution
    return validationResult



module.exports = {
  Validator
}
