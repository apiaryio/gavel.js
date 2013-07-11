async       = require 'async'

{extendable}    = require '../utils/extendable'
errors          = require '../errors'
{BodyValidator}      = require '../validators/body-validator'
{HeadersValidator}      = require '../validators/headers-validator'

validatable =
  validate: (cb) ->
    result =
      headers: @validateHeaders(),
      body: @validateBody(),
      statusCode: @validateStatus()
    return result

  isValidatable : () ->
    return true

  isValid : () ->
      @validateBody().length == 0 and @validateHeaders().length == 0 and @validateStatus()

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
    if typeof @validateBodyResult == 'undefined'
      @validateBodyResult = @getValidator('body').validate()
    return @validateBodyResult

  #@private
  validateHeaders: () ->
    if typeof @validateHeadersResult == 'undefined'
      @validateHeadersResult = @getValidator('headers').validate()
    return @validateHeadersResult

  #@private
  validateStatus: () ->
    if typeof @validateStatusCodeResult == 'undefined'
      if not @statusCode
        @validateStatusCodeResult = true
      else
        @validateStatusCodeResult = (@statusCode == @expected?.statusCode)
    return @validateStatusCodeResult

  #@private
  validatableObject: () ->
    true

validatableMessage =
  validate: () ->
    return {
      httpRequest: @httpRequest.validate(),
      httpResponse: @httpResponse.validate()
    }

  isValidatable : () ->
    @httpRequest.isValidatable() and @httpResponse.isValidatable()

  isValid : () ->
    @httpRequest.isValid() and @httpResponse.isValid()


  #@private
  validatableObject: () ->
    @httpRequest.validatableObject and @httpResponse.validatableObject and @httpRequest.validatableObject() and @httpResponse.validatableObject()


Function.prototype.actAsValidatable = () ->
  extendable.include validatable, @

Function.prototype.actAsValidatableMessage = () ->
  extendable.include validatableMessage, @

