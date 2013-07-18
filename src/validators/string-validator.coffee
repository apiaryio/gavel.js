{ValidationErrors} = require('./validation-errors')
errors          = require '../errors'

# Validates if given strings are equal
# @author Peter Grilli <tully@apiary.io>
class StringValidator
  # Construct a StringValidator and checks given data
  #@option {} [String] string1 data to validate
  #@option {} [String] string2 json schema
  #@throw {DataNotStringError} when given string1 or string2 is not {String}
  constructor: ({@string1, @string2}) ->
    if typeof(@string1) != 'string'
      outError = new errors.DataNotStringError 'String validator: input data is not string'
      outError['data'] = @string1
      throw outError

    if typeof(@string2) != 'string'
      outError = new errors.DataNotStringError 'String validator: input data is not string'
      outError['data'] = @string2
      throw outError

  #Validates if given strings are equal
  #@return [ValidationErrors]
  validate: ->
    if @string1 != @string2
      error = {
        "0":{
          "property":[],
          "attributeValue":true,
          "message":"Real value differs from expected",
          "validatorName":"string",
        },
        "length":1,
        "errorMessages":{
        }
      }
    else
      error = {
        "length":0,
        "errorMessages":{
        }
      }

    return new ValidationErrors error


  #@private
  getHash: (data) ->
    crypto.createHash('md5').update(JSON.stringify(data)).digest('hex')

module.exports = {
  StringValidator
}