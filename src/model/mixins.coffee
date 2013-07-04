async       = require 'async'

{extendable}    = require '../utils/extendable'
errors          = require '../errors'
{BodyValidator}      = require '../validators/body-validator'
{HeadersValidator}      = require '../validators/headers-validator'

validatable =
  validate: (cb) ->
    result = null
    outError = null

    try
      result =
        headers: @validateHeaders(),
        body: @validateBody(),
        statusCode: @validateStatus()
    catch error
      outError = error

    return cb outError, result

  isValidatable : (cb) ->
    return cb null, true

  isValid : (cb) ->
    result = null
    outError = null

    try
      result = (@validateBody().length == 0) && (@validateHeaders().length == 0) and @validateStatus()
    catch error
      outError = error

    return cb outError, result

  #@private
  #@params
  # type: ['body','headers']
  getValidator: (type) ->
    switch type
      when 'body' then return new BodyValidator {real: @body, expected: @expected.body, schema: @expected.bodySchema}
      when 'headers' then return new HeadersValidator {real: @headers, expected: @expected.headers, schema: @expected.headersSchema}
      else throw new errors.UnknownValidatorError "no validator found for type: #{type}"



  #@private
  validateBody: () ->
    return @getValidator('body').validate()

  #@private
  validateHeaders: () ->
    return @getValidator('headers').validate()

  #@private
  validateStatus: () ->
    if not @statusCode
      return true

    return @statusCode == @expected?.statusCode

  #@private
  validatableObject: () ->
    true

validatableMessage =
  validate: (cb) ->
    async.parallel {
      httpRequest: (cb) =>
        @httpRequest.validate cb
      ,
      httpResponse: (cb) =>
        @httpResponse.validate cb

      }, (err, result) ->
        if err
          return cb err
        result =
          httpRequest: result['httpRequest'],
          httpResponse: result['httpResponse']
        return cb null, result

  isValidatable : (cb) ->
    async.parallel {
        httpRequest: (cb) =>
          @httpRequest.isValidatable cb
        ,
        httpResponse: (cb) =>
          @httpResponse.isValidatable cb

      }, (err, result) ->
        if err
          return cb err
        return cb null, result['httpRequest'] and result['httpResponse']


  isValid : (cb) ->
    async.parallel {
        httpRequest: (cb) =>
          @httpRequest.isValid cb
        ,
        httpResponse: (cb) =>
          @httpResponse.isValid cb

      }, (err, result) ->
        if err
          return cb err
        return cb null, result['httpRequest'] and result['httpResponse']



  #@private
  validatableObject: () ->
    @httpRequest.validatableObject and @httpResponse.validatableObject and @httpRequest.validatableObject() and @httpResponse.validatableObject()


Function.prototype.actAsValidatable = () ->
  extendable.include validatable, @

Function.prototype.actAsValidatableMessage = () ->
  extendable.include validatableMessage, @

