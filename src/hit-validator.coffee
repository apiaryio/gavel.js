{Validator}                         = require('../src/validator')
{StringToJson}                      = require('../src/string-to-json')
{SchemaGenerator, SchemaProperties} = require('../src/schema-generator')


# HitValidator is constructed for given Hit
# Call .validate() to execute all validators against all parts of the hit
# Examine new validationResults on hit.request/response attributes for
# validation results
HitValidator = class HitValidator
  constructor: (@hit) ->
    @requestBodyValidator = @getBodyValidator 'request'
    @requestHeadersValidator = @getHeadersValidator 'request'
    @responseBodyValidator = @getBodyValidator 'response'
    @responseHeadersValidator = @getHeadersValidator 'response'

  validate: ->
    @hit.request['validationResults'] = {
      headers: @requestHeadersValidator.validate(),
      body: @requestBodyValidator.validate()
    }

    @hit.response['validationResults'] = {
      headers: @responseHeadersValidator.validate(),
      body: @responseBodyValidator.validate()
    }

    return @hit

  prepareHeaders: (headers) ->
    transformedHeaders = {}

    for key, value of headers
      transformedHeaders[key.toLowerCase()] = value.toLowerCase()

    return transformedHeaders

  prepareBody: (body) ->
    if body == ''
      return {}
    return body

  getBodyValidator: (type) ->

    if @hit[type].defined.schema?.body and Object.keys(JSON.parse @hit[type].defined.schema?.body).length > 0
      schema = JSON.parse @hit[type].defined.schema?.body
    else
      try
        dataDefined = JSON.parse @hit[type].defined.body
        schema = @getSchema data: dataDefined, type: 'body'
      catch
        stj = new StringToJson @hit[type].defined.body
        dataDefined = stj.generate()
        schema = @getSchema data: dataDefined, type: 'string_body'
      @hit[type].defined.schema?.body = JSON.stringify schema

    try
      dataReal = JSON.parse @hit[type].realPayload.body
    catch
      stj = new StringToJson @hit[type].realPayload.body
      dataReal = stj.generate()

    return new Validator(data: dataReal, schema: schema)

  getHeadersValidator: (type) ->
    if @hit[type].defined.schema?.headers and typeof(@hit[type].defined.schema.headers) == 'object' and Object.keys(@hit[type].defined.schema?.headers).length > 0
      schema = JSON.parse @hit[type].defined.schema?.headers
    else
      schema = @getSchema data: @prepareHeaders(@hit[type].defined.headers), type: 'headers'
      @hit[type].defined.schema?.headers = JSON.stringify schema

    return new Validator(data: @prepareHeaders(@hit[type].realPayload.headers), schema: schema)

  getSchema: ({data, type, properties})->
    properties = if properties then properties else new SchemaProperties {}

    switch type
      when 'headers'
        properties.setProperties keysStrict: false, valuesStrict: true, typesStrict: false #typesStrict?
      when 'string_body'
        properties.setProperties keysStrict: true, valuesStrict: true, typesStrict: false
      else
        properties.setProperties properties, keysStrict: false, valuesStrict: false, typesStrict: false

    schemaGenerator = new SchemaGenerator json: data, properties: properties

    return schemaGenerator.generate()

module.exports = {
  HitValidator
}
