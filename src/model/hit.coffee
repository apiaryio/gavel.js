packageJson    = require('../../package.json')

HitStructure = class HitStructure
  constructor: ->
    # As you might store HitStructure in persistent store, we are assigning
    # version for every HitStructe released.
    # If new version is not clean superset, methods for transforming one
    # version into any later will be provided.
    @schemaVersion = 2
    @validatorVersion = "#{packageJson.version}"

    @request =
      validationResults:
        headers: null
        body: null

      expected:
        userSchemas: []
        headers: {}
        body: ''
        schema:
          headers: ''
          body: ''

      real:
        headers: {}
        body: ''

    @response =
      validationResults:
        headers: null
        body: null
        statusCode: null

      expected:
        userSchemas: []
        headers: {}
        body: ''
        schema:
          headers: ''
          body: ''
        statusCode: ''

      real:
        headers: {}
        body: ''
        statusCode: ''


