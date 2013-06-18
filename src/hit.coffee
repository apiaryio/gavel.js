module.exports.hitStructure = class hitStructure
  constructor: ->
    @schemaVersion = 2
    @request =
      validationResults: {}

      defined:
        userSchemas: []
        headers: {}
        body: ''
        schema:
          headers: {}
          body: {}

      realPayload:
        headers: {}
        body: ''


    @response =
      validationResults: {}

      defined:
        userSchemas: []
        headers: {}
        body: ''
        schema:
          headers: {}
          body: {}
        statusCode: ''

      realPayload:
        headers: {}
        body: ''
        statusCode: ''


    @validatorVersion = ''
