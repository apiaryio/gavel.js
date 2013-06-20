packageJson = require('../package.json')

module.exports.hitStructure = class hitStructure
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

