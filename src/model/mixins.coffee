async       = require 'async'

{extendable}    = require '../utils/extendable'
errors          = require '../errors'
{BodyValidator}      = require '../validators/body-validator'
{HeadersValidator}      = require '../validators/headers-validator'

# validatable mixin.
#
# @mixin
# @author Peter Grilli <tully@apiary.io>
validatable =
  #Validates headers, body and status attributes of mixed class
  #@return [Object] :headers {ValidationErrors}, :body {ValidationErrors}, :statusCode [Boolean]
  validate: () ->
    result  =
      headers: @validateHeaders(),
      body: @validateBody(),
      statusCode: @validateStatus()
    return result

  #checks if mixed object is suitable for validation
  #@return [Boolean]true if  mixed class is validatable
  isValidatable : () ->
    return true

  #returns if mixed object is valid
  #@return [Boolean]true if  mixed class is valid
  isValid : () ->
      @validateBody().length == 0 and @validateHeaders().length == 0 and @validateStatus()

  #@private
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

# validatableMessage mixin.
#
# @mixin
# @author Peter Grilli <tully@apiary.io>
validatableMessage =
  #Validates httpRequest, httpResponse attributes of mixed class
  #@return [Object] :httpRequest [Object], :httpResponse [Object]
  validate: () ->
    return {
      httpRequest: @httpRequest.validate(),
      httpResponse: @httpResponse.validate()
    }

  #checks if mixed obhect is suitable for validation
  #@return [Boolean] true if  mixed class is validatable
  isValidatable : () ->
    @httpRequest.isValidatable() and @httpResponse.isValidatable()

  #returns if mixed object is valid
  #@return [Boolean] true if  mixed class is valid
  isValid : () ->
    @httpRequest.isValid() and @httpResponse.isValid()


  #@private
  validatableObject: () ->
    @httpRequest.validatableObject and @httpResponse.validatableObject and @httpRequest.validatableObject() and @httpResponse.validatableObject()


# adds validatable mixin to class where its called
# @author Peter Grilli <tully@apiary.io>
Function.prototype.actAsValidatable = () ->
  extendable.include validatable, @

# adds validatableMessage mixin to class where its called
# @author Peter Grilli <tully@apiary.io>
Function.prototype.actAsValidatableMessage = () ->
  extendable.include validatableMessage, @

