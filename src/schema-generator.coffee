SCHEMA_VERSION = "http://json-schema.org/draft-03/schema"

module.exports.SchemaProperties = class SchemaProperties
  keysStrict = false
  valuesStrict = false
  typesStrict = false

module.exports.SchemaGenerator = class SchemaGenerator

  constructor: ( json ) ->
    if typeof json == 'string'
      @json = JSON.parse json
    else
      @json = json

    @schema = undefined
    @properties = new SchemaProperties


  setProperties: ({keysStrict, valuesStrict, typesStrict}) ->
    @properties.keysStrict   = keysStrict
    @properties.valuesStrict = valuesStrict
    @properties.typesStrict  = typesStrict


  generate: () ->
    return @schema = @getSchemaForObject baseObject: @json, objectId: undefined, firstLevel: true, properties: @properties


  getSchemaTypeFor: (val) ->
    if @isArray val then return 'array'

    type = typeof val

    if type is 'undefined' then return 'null'
    if type is 'number' and val % 1 == 0 then return 'integer'

    return type


  isBaseType: (type) ->
    !(type in ["array", "object"])

  getSchemaForObject: ({baseObject, objectId, firstLevel, properties}) ->
    if firstLevel is undefined then firstLevel = true
    properties ||= new SchemaProperties

    schemaDict = {}

    if firstLevel
      schemaDict["$schema"] = SCHEMA_VERSION
      schemaDict["id"] = "#"

    if objectId isnt undefined
      schemaDict["id"] = objectId

    schemaType = @getSchemaTypeFor baseObject

    schemaDict["required"] = true

    if schemaType is 'object'
      if properties.keysStrict
        schemaDict['additionalProperties'] = false
      else
        schemaDict['additionalProperties'] = true

    if schemaType is 'array'
      if properties.keysStrict
        schemaDict['additionalItems'] = false
      else
        schemaDict['additionalItems'] = true

    if properties.valuesStrict and @isBaseType schemaType
      schemaDict['enum'] = [baseObject]

    if (properties.typesStrict and @isBaseType schemaType) or not @isBaseType schemaType
      schemaDict["type"] = schemaType

    if schemaType is 'object' and Object.keys(baseObject).length > 0
      schemaDict["properties"] = {}

      for prop, value of baseObject
        schemaDict["properties"][prop] = @getSchemaForObject baseObject: value, objectId: prop, firstLevel: false, properties: properties

    else if schemaType is 'array' and baseObject.length > 0

      schemaDict['items'] = []
      counter = 0

      for item in baseObject
        schemaDict['items'].push(@getSchemaForObject baseObject: item, objectId: counter, firstLevel: false, properties: properties)
        counter += 1

    return schemaDict


  isArray: (object) ->
    return object instanceof Array



