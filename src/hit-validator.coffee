{Validator}                         = require('./validator')
{StringToJson}                      = require('./string-to-json')
{SchemaGenerator, SchemaProperties} = require('./schema-generator')


# HitValidator is constructed for given Hit
# Call .validate() to execute all validators against all parts of the hit
# Examine new validationResults on hit.request/response attributes for
# validation results
HitValidator = class HitValidator
  constructor: (@hit, @updateHit = true) ->
    @requestBodyValidator = @getBodyValidator 'request'
    @requestHeadersValidator = @getHeadersValidator 'request'
    @responseBodyValidator = @getBodyValidator 'response'
    @responseHeadersValidator = @getHeadersValidator 'response'

  validate: ->
    requestHeadersValidationResult  = @requestHeadersValidator.validate()
    requestBodyValidationResult     = @requestBodyValidator.validate()
    responseHeadersValidationResult = @responseHeadersValidator.validate()
    responseBodyValidationResult    = @responseBodyValidator.validate()

    if @updateHit
      @hit.request['validationResults'] = {
        headers: requestHeadersValidationResult,
        body: requestBodyValidationResult
      }

      @hit.response['validationResults'] = {
        headers: responseHeadersValidationResult,
        body: responseBodyValidationResult
      }

    return @hit

  #@private
  prepareHeaders: (headers) ->
    transformedHeaders = {}

    for key, value of headers
      key = key.toLowerCase()
      #ref:
      # http://www.w3.org/Protocols/rfc2616/rfc2616-sec4.html
      # http://www.w3.org/Protocols/rfc1341/4_Content-Type.html
      if key == 'content-type'
        transformedHeaders[key] = value.toLowerCase()
      else
        transformedHeaders[key] = value

    return transformedHeaders

  #@private
  prepareBody: (body) ->
    if body == ''
      return {}
    return body

  #@private
  getBodyValidator: (type) ->

    if @hit[type].defined.schema?.body and Object.keys(JSON.parse @hit[type].defined.schema?.body).length > 0
      schema = JSON.parse @hit[type].defined.schema?.body
    else
      try
        dataDefined = JSON.parse @hit[type].defined.body
        schema = @getSchema data: dataDefined, type: 'body'
      catch error
        stj = new StringToJson @hit[type].defined.body
        dataDefined = stj.generate()
        schema = @getSchema data: dataDefined, type: 'string_body'
      @hit[type].defined.schema?.body = JSON.stringify schema

    try
      dataReal = JSON.parse @hit[type].realPayload.body
    catch error
      stj = new StringToJson @hit[type].realPayload.body
      dataReal = stj.generate()

    return new Validator(data: dataReal, schema: schema)

  #@private
  getHeadersValidator: (type) ->
    if @hit[type].defined.schema?.headers and typeof(@hit[type].defined.schema.headers) == 'object' and Object.keys(@hit[type].defined.schema?.headers).length > 0
      schema = JSON.parse @hit[type].defined.schema?.headers
    else
      schema = @getSchema data: @prepareHeaders(@hit[type].defined.headers), type: 'headers'
      @hit[type].defined.schema?.headers = JSON.stringify schema

    return new Validator(data: @prepareHeaders(@hit[type].realPayload.headers), schema: schema)

  #@private
  getSchema: ({data, type, properties})->
    properties = if properties then properties else new SchemaProperties {}

    switch type
      when 'headers'
        properties.keysStrict   = false
        properties.valuesStrict = true
        properties.typesStrict  = false
      when 'string_body'
        properties.keysStrict   = true
        properties.valuesStrict = true
        properties.typesStrict  = false
      else
        properties.keysStrict   = false
        properties.valuesStrict = false
        properties.typesStrict  = false

    schemaGenerator = new SchemaGenerator json: data, properties: properties

    return schemaGenerator.generate()

validate = (hit) ->
  hitValidator = new HitValidator hit
  return hitValidator.validate()

module.exports = {
  HitValidator,
  validate
}
