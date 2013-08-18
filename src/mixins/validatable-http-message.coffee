async = require 'async'

errors = require '../errors'
{extendable} = require '../utils/extendable.coffee'

validators = require '../validators'

# validatable mixin.
#
# @mixin
# @author Peter Grilli <tully@apiary.io>
validatable =

  validatableComponents: ['headers', 'body', 'statusCode']

  #Validates all HTTP components available in the message
  #@return [Object] :headers {ValidationErrors}, :body {ValidationErrors}, :statusCode [Boolean]
  validate: () ->
    @validation = {}
    @validateHeaders() unless @headers == undefined
    @validateBody() unless @body == undefined

  #returns true if object has any validatable entity
  #@return [Boolean]
  isValidatable: () ->
    result = false
    @validatableComponents.forEach (component) =>
      unless @[component] == undefined
        result = true
    result
  
  # returns false if any validatable HTTP component has validation
  # property with any result messages with the error severity
  # @return [Boolean]
  isValid: () ->
    output = true
    @validate() if @validation == undefined
    @validatableComponents.forEach (component) =>
      unless @validation[component] == undefined
        if Array.isArray this.validation[component].results
          @validation[component].results.forEach (result) =>
            if result['severity'] == 'error'
              output = false
    output

  validationResults: () ->
    @validate() if @validation == undefined
    @validation

  # Headers validation
  validateHeaders: () ->
    @validation.headers = {}
    @validation.headers.results = []
    @setHeadersRealType()
    @setHeadersExpectedType()
    @setHeadersValidator()
    @runHeadersValidator()
    @setHeadersResults()


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
    if @validation.headers.realType == 
         "application/vnd.apiary.http-headers+json" and 
       @validation.headers.expectedType == 
         "application/vnd.apiary.http-headers+json" 
      @validation.headers.validator = "HeadersJsonExample"
    else
      @validation.headers.validator = null
      if @validation.headers.results == undefined
        @validation.headers.results = []
      
      entry =
        severity: 'error'
        message: 'No validator found for real data media type "' + 
          + JSON.stringify(@validation.headers.realType) +
          '" and expected data media type "' +
          + JSON.stringify(@validation.headers.expectedType) + 
          '".' 
      
      @validation.headers.results.push entry

  runHeadersValidator: () ->
    if @validation.headers.validator == null
      @validation.headers.rawData = null
    else
      validatorClass = validators[@validation.headers.validator]
      validator = new validatorClass @headers, @expected.headers 
      @validation.headers.rawData = validator.validate()
      
  
  setHeadersResults: () ->
    if not Array.isArray @validation.headers.results
      @validation.headers.results = [] 
    validatorClass = validators[@validation.headers.validator]
    results = validatorClass.evaluateOutputToResults @validation.headers.rawData
    @validation.headers.results = results.concat @validation.headers.results
  

  # Body validation
  validateBody: () ->
    @validation.body = {}
    @validation.body.results = []

    @setBodyRealType()
    @setBodyExpectedType()
    @setBodyValidator()
    @runBodyValidator()
    @setBodyResults()

  setBodyRealType: () ->
    @validation.body.realType = null
    
    unless typeof @body == 'string'
      throw new Error "HTTP Body is not a String."

    if !(@headers == undefined) and !(@headers['content-type']  == undefined) and @headers['content-type'] == 'application/json'
      try
        JSON.parse @body
        @validation.body.realType = 'application/json'
      catch error
        message = {
          message: 'Unknown real body media type. Content-type header is "application/json" but body is not a parseble JSON.'
          severity: 'error'
        }
        @validation.body.results.push message
    else
      try
        JSON.parse @body
        @validation.body.realType = 'application/json'
      catch error
        @validation.body.realType = 'text/plain'    


  setBodyExpectedType: () ->
    @validation.body.expectedType = null

  setBodyValidator: () ->
    @validation.body.validator = null
  
  runBodyValidator: () ->
    @validation.body.rawData = null

  setBodyResults: () ->

  # Status code validation
  validateStatusCode: () ->


# adds validatable mixin to class where its called
# @author Peter Grilli <tully@apiary.io>
Function.prototype.actAsValidatable = () ->
  extendable.include validatable, @


