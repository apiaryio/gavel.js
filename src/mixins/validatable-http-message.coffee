async = require 'async'

errors = require '../errors'
{extendable} = require '../utils/extendable'

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
    @validateStatusCode() unless @statusCode == undefined    
    @validation

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

    isJsonContentType = false

    # TODO refactor to separate unit when adding more complicated logic
    # e.g. for application/hal+json or or application/vnd.apiary.something
    if !(@headers == undefined) and !(@headers['content-type']  == undefined)
      isJsonContentType = @headers['content-type'].split(';')[0] == 'application/json'
    
    if isJsonContentType
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
    if @validation.body.results == undefined
      @validation.body.results = []

    if !(@expected.bodySchema == undefined) and
      !(@expected.bodySchema == null)
        if typeof @expected.bodySchema == 'string'
          try
            parsed = JSON.parse @expected.bodySchema
            if typeof parsed != 'object' or Array.isArray parsed 
              message = {
                message: 'Expected:JSON Schema provided, but it is not an Object'
                severity: 'error'
              }
              @validation.body.results.push message  
            else
              @validation.body.expectedType = 'application/schema+json'
          catch error
            message = {
              message: 'Expected: JSON Schema provided, but it is not a parseable JSON'
              severity: 'error'
            }
            @validation.body.results.push message        
            return
        else
          @validation.body.expectedType = 'application/schema+json'          
    else

      isJsonContentType = false
      # TODO refactor to separate unit when adding more complicated logic
      # e.g. for application/hal+json or or application/vnd.apiary.something
      if !(@expected.headers == undefined) and !(@expected.headers['content-type']  == undefined)
        isJsonContentType = @expected.headers['content-type'].split(';')[0] == 'application/json'

      if isJsonContentType
          try
            JSON.parse @expected.body
            @validation.body.expectedType = 'application/json'
          catch error
            message = {
              message: 'Expected: Content-Type is application/json but body is not a parseable JSON '
              severity: 'error'
            }           
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
        
    if @validation.body.realType == null and @validation.body.expectedType == null
      message = {
        message: 'Unknown real and expected type. No validator found.'
        severity: 'error'
      }           
      @validation.body.results.push message
    else
      if @validation.body.realType == 'application/json'
        if @validation.body.expectedType == 'application/json'
          @validation.body.validator = 'JsonExample'
        else if @validation.body.expectedType == 'application/schema+json'
          @validation.body.validator = 'JsonSchema'
        else
          message = 
            message: "No validator found for real data media type '#{@validation.body.realType}' and expected data media type '#{@validation.body.expectedType}'."
            severity: 'error'

          @validation.body.results.push message       

      else if @validation.body.realType == 'text/plain'
        if @validation.body.expectedType == 'text/plain'
          @validation.body.validator = 'TextDiff'        
        else
          message = 
            message: "No validator found for real data media type '#{@validation.body.realType}' and expected data media type '#{@validation.body.expectedType}'."
            severity: 'error'

          @validation.body.results.push message       

      else
        message = 
          message: "No validator found for real data media type '#{@validation.body.realType}' and expected data media type '#{@validation.body.expectedType}'."
          severity: 'error'
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

      validator = new validatorClass real, expected
      @validation.body.rawData = validator.validate()

    if @validation.body.validator != null
      if not Array.isArray @validation.body.results
        @validation.body.results = [] 

      results = validator.evaluateOutputToResults()
      @validation.body.results = results.concat @validation.body.results
  
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
  


# adds validatable mixin to class where its called
# @author Peter Grilli <tully@apiary.io>
Function.prototype.actAsValidatable = () ->
  extendable.include validatable, @


