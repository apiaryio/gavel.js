{SchemaGenerator, SchemaProperties} = require('../src/schema-generator')
{StringToJson} = require('../src/string-to-json')
amanda = require 'amanda'


class HitValidationInputDataError extends Error

module.exports.Validator = class Validator

  constructor: ({data, schema}) ->
    if typeof data == 'string'
      @data = JSON.parse data
    else
      @data = data

    @schema = schema

  validate: ->
    return amanda.validate  @data, @schema, (error) ->
      return error

  #classmethods
  @getSchema: ({data, type, properties})->
    properties = if properties then properties else new SchemaProperties

    switch type
      when 'headers'
        @setProperties properties: properties, keysStrict: false, valuesStrict: true, typesStrict: false #typesStrict
      when 'string_body'
        @setProperties properties: properties, keysStrict: true, valuesStrict: true, typesStrict: false
      else
        @setProperties properties: properties, keysStrict: false, valuesStrict: false, typesStrict: false

    schemaGenerator = new SchemaGenerator data
    schemaGenerator.setProperties keysStrict: properties.keysStrict, valuesStrict: properties.valuesStrict, typesStrict: properties.typesStrict
    return schemaGenerator.generate()

  @setProperties: ({properties, keysStrict, valuesStrict, typesStrict}) ->
    properties.keysStrict   = keysStrict
    properties.valuesStrict = valuesStrict
    properties.typesStrict  = typesStrict

module.exports.HitValidation = class HitValidation

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

  getBodyValidator: (type) ->
    if @hit[type].defined.schema?.body and  Object.keys(@hit[type].defined.schema?.body).length > 0
      schema = @hit[type].defined.schema?.body
    else
      try
        dataDefined = JSON.parse @hit[type].defined.body
        schema = module.exports.Validator.getSchema data: dataDefined, type: 'body'
      catch
        stj = new StringToJson @hit[type].defined.body
        dataDefined = stj.generate()
        schema = module.exports.Validator.getSchema data: dataDefined, type: 'string_body'

    try
      dataReal = JSON.parse @hit[type].realPayload.body
    catch
      stj = new StringToJson @hit[type].realPayload.body
      dataReal = stj.generate()

    return new module.exports.Validator(data: dataReal, schema: schema)

  getHeadersValidator: (type) ->
    if @hit[type].defined.schema?.headers and Object.keys(@hit[type].defined.schema?.headers).length > 0
      schema = @hit[type].defined.schema?.headers
    else
      schema = module.exports.Validator.getSchema data: @hit[type].defined.headers, type: 'headers'

    return new module.exports.Validator(data: @hit[type].realPayload.headers, schema: schema)










