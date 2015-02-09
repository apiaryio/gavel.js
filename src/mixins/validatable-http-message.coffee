jsonlint = require 'jsonlint'
mediaTyper = require 'media-typer'
validators = require '../validators'

# validatable mixin.
#
# @mixin
# @author Peter Grilli <tully@apiary.io>
class Validatable

  validatableComponents: ['headers', 'body', 'statusCode']

  #Validates all HTTP components available in the message
  #@return [Object] :headers {ValidationErrors}, :body {ValidationErrors}, :statusCode [Boolean]
  validate: ->
    @validation = {}
    @validation.version = '2'
    @lowercaseHeaders()

    @validateHeaders()    if @headers? and @expected?.headers?
    @validateBody()       if @body? and @expected?.body? and @expected.bodySchema?
    @validateStatusCode() if @statusCode?
    @validation

  #returns true if object has any validatable entity
  #@return [Boolean]
  isValidatable: ->
    result = false
    for component in @validatableComponents
      unless @[component] == undefined
        result = true
    return result

  # returns false if any validatable HTTP component has validation
  # property with any result messages with the error severity
  # @return [Boolean]
  isValid: ->
    @validate() unless @validation?
    for component in @validatableComponents
      if Array.isArray @validation[component]?.results
        for result in @validation[component].results when result.severity is 'error'
          return false
    return true

  validationResults: ->
    @validate() unless @validation?
    @validation

  lowercaseHeaders: ->
    if @headers?
      headers = {}
      for name, value of @headers
        headers[name.toLowerCase()] = value
      @headers = headers

    if @expected?.headers?
      expectedHeaders = {}
      for name, value of @expected.headers
        expectedHeaders[name.toLowerCase()] = value
      @expected.headers = expectedHeaders


  # Headers validation
  validateHeaders: ->
    @validation.headers = {}
    @validation.headers.results = []
    @setHeadersRealType()
    @setHeadersExpectedType()
    @setHeadersValidator()
    @runHeadersValidator()

  setHeadersRealType: () ->
    if @headers instanceof Object and not Array.isArray @headers
      @validation.headers.realType =
        "application/vnd.apiary.http-headers+json"
    else
      @validation.headers.realType = null

  setHeadersExpectedType: () ->
    if @expected.headers instanceof Object and not Array.isArray @expected.headers
      @validation.headers.expectedType =
        "application/vnd.apiary.http-headers+json"
    else
      @validation.headers.expectedType = null

  setHeadersValidator: () ->
    if @validation.headers.realType is @validation.headers.expectedType is
      "application/vnd.apiary.http-headers+json"
        @validation.headers.validator = "HeadersJsonExample"
    else
      @validation.headers.validator = null
      @validation.headers.results ?= []

      entry =
        severity: 'error'
        message: """
          No validator found for real data media type \
          "#{JSON.stringify(@validation.headers.realType)}" \
          and expected data media type \
          "#{JSON.stringify(@validation.headers.expectedType)}".
        """

      @validation.headers.results.push entry

  runHeadersValidator: () ->
    #throw new Error JSON.stringify @validation.headers.validator, null, 2
    if @validation.headers.validator == null
      @validation.headers.rawData = null
    else
      validatorClass = validators[@validation.headers.validator]
      validator = new validatorClass @headers, @expected.headers
      @validation.headers.rawData = validator.validate()

    if not Array.isArray @validation.headers.results
        @validation.headers.results = []

    if @validation.headers.rawData != null
      results = validator.evaluateOutputToResults()
      @validation.headers.results = results.concat @validation.headers.results


  # Body validation
  validateBody: () ->
    @validation.body = {}
    @validation.body.results = []

    @setBodyRealType()
    @setBodyExpectedType()
    @setBodyValidator()
    @runBodyValidator()

  setBodyRealType: () ->
    @validation.body.realType = null

    unless typeof @body == 'string'
      throw new Error "HTTP Body is not a String."

    contentType = @headers?['content-type']
    if @isJsonContentType contentType
      try
        jsonlint.parse @body
        @validation.body.realType = contentType
      catch error
        message = {
          message: 'Unknown real body media type. Content-type header is "' + contentType + '" but body is not a parseble JSON.'
          severity: 'error'
        }
        message.message  = message.message + "\n" + error.message
        @validation.body.results.push message
    else
      try
        JSON.parse @body
        @validation.body.realType = 'application/json'
      catch error
        @validation.body.realType = 'text/plain'


  setBodyExpectedType: () ->
    @validation.body.expectedType = null
    if @validation.body.results == undefined
      @validation.body.results = []

    if !(@expected.bodySchema == undefined) and
      !(@expected.bodySchema == null)
        if typeof @expected.bodySchema == 'string'
          try
            parsed = JSON.parse @expected.bodySchema
            if typeof parsed != 'object' or Array.isArray parsed
              message = {
                message: 'Expected body: JSON Schema provided, but it is not an Object'
                severity: 'error'
              }
              @validation.body.results.push message
            else
              @validation.body.expectedType = 'application/schema+json'
          catch error
            message = {
              message: 'Expected body: JSON Schema provided, but it is not a parseable JSON'
              severity: 'error'
            }
            @validation.body.results.push message
            return
        else
          @validation.body.expectedType = 'application/schema+json'
    else

      expectedContentType = @expected.headers?['content-type']

      if @isJsonContentType expectedContentType
        try
          jsonlint.parse @expected.body
          @validation.body.expectedType = expectedContentType
        catch error
          message = {
            message: 'Expected body: Content-Type is ' + expectedContentType + ' but body is not a parseable JSON'
            severity: 'error'
          }
          message.message = message.message + ": " +error.message
          @validation.body.results.push message
      else
        try
          JSON.parse @expected.body
          @validation.body.expectedType = 'application/json'
        catch error
          @validation.body.expectedType = 'text/plain'


  setBodyValidator: () ->
    @validation.body.validator = null

    if @validation.body.results == undefined
      @validation.body.results = []

    message =
      message: "No validator found for real data media type '#{@validation.body.realType}' and expected data media type '#{@validation.body.expectedType}'."
      severity: 'error'

    if @validation.body.realType == null and @validation.body.expectedType == null
      message = {
        message: 'Unknown real and expected type. No validator found.'
        severity: 'error'
      }
      @validation.body.results.push message
    else
      if @isJsonContentType @validation.body.realType
        if @validation.body.expectedType == 'application/schema+json'
          @validation.body.validator = 'JsonSchema'
        else if @isJsonContentType @validation.body.expectedType
          @validation.body.validator = 'JsonExample'
        else
          message =
            message: "Watchout for malformed JSON. Expected data media type ('#{@validation.body.expectedType}') does not match real media type ('#{@validation.body.realType}')."
            severity: 'error'

          @validation.body.results.push message

      else if @validation.body.realType == 'text/plain'
        if @validation.body.expectedType == 'text/plain'
          @validation.body.validator = 'TextDiff'
        else
          @validation.body.results.push message

      else
        @validation.body.results.push message

  runBodyValidator: () ->
    if @validation.body.validator == null
      @validation.body.rawData = null
    else
      validatorClass = validators[@validation.body.validator]
      if @validation.body.validator == 'JsonSchema'
        real = @body
        expected = @expected.bodySchema
      else
        real = @body
        expected = @expected.body

      if @validation.body.validator != null
        if not Array.isArray @validation.body.results
          @validation.body.results = []

      try
        validator = new validatorClass real, expected
        @validation.body.rawData = validator.validate()

        results = validator.evaluateOutputToResults()
        @validation.body.results = results.concat @validation.body.results

      catch error
        message =
          message: error.message
          severity: 'error'

        @validation.body.results.push message


  # Status code validation
  validateStatusCode: () ->
    @validation.statusCode = {}
    @validation.statusCode.realType = "text/vnd.apiary.status-code"
    @validation.statusCode.expectedType = "text/vnd.apiary.status-code"
    @validation.statusCode.validator = 'TextDiff'

    real = String(@statusCode).trim()
    expected = String(@expected.statusCode).trim()

    validator = new validators.TextDiff real, expected
    @validation.statusCode.rawData = validator.validate()

    @validation.statusCode.results = []
    results = validator.evaluateOutputToResults()
    @validation.statusCode.results = results.concat @validation.statusCode.results

  isJsonContentType: (contentType) ->
    result = false

    if contentType?
      parsed = mediaTyper.parse "#{contentType}"

      if parsed['type'] == 'application' and parsed['subtype'] == 'json'
        result = true

      if parsed['suffix'] == 'json'
        result = true

    result

module.exports = {
  Validatable
}
