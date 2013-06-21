packageJson = require('../package.json')
{HitValidator} = require('../src/hit-validator')

module.exports.HitStructure = class HitStructure
  constructor: ->
    @schemaVersion = 2

    @request =
      validationResults:
        headers: null
        body: null

      defined:
        userSchemas: []
        headers: {}
        body: ''
        schema:
          headers: ''
          body: ''

      realPayload:
        headers: {}
        body: ''

    @response =
      validationResults:
        headers: null
        body: null

      defined:
        userSchemas: []
        headers: {}
        body: ''
        schema:
          headers: ''
          body: ''
        statusCode: ''

      realPayload:
        headers: {}
        body: ''
        statusCode: ''

    @validatorVersion = "#{packageJson.version}"

module.exports.Hit = class Hit extends HitStructure

  validate: ->
    if not @validator then @validator = new HitValidator @
    @validator.validate()

  isValid: ->
    @validate()

    results = [
      @request['validationResults']['headers'],
      @request['validationResults']['body'],
      @response['validationResults']['headers'],
      @response['validationResults']['body']
    ]

    for result in results
      if not @checkIfResultValid result
        return false

    return true

  checkIfResultValid: (result) ->
    return not (result and typeof(result) == 'object' and Object.keys(result).length > 0)

  validationResults: ->
    @validate()
    result =  {
              request: {
                headers   : @request['validationResults']['headers'],
                body      : @request['validationResults']['body']
              },
              response: {
                headers   : @response['validationResults']['headers'],
                body      : @response['validationResults']['body']
              }
    }
    return result

