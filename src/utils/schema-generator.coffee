SCHEMA_VERSION = "http://json-schema.org/draft-03/schema"

# Configuration structure for SchemaGenerator
class SchemaProperties
  constructor: ({keysStrict, valuesStrict, typesStrict}) ->
    @set {keysStrict: keysStrict || false, valuesStrict: valuesStrict || false, typesStrict: typesStrict || false}

  set: ({keysStrict, valuesStrict, typesStrict}) ->
    @.keysStrict   = keysStrict
    @.valuesStrict = valuesStrict
    @.typesStrict  = typesStrict

# From given JSON or object, construct JSON schema for Amanda
class SchemaGenerator
  constructor: ( {json, properties} ) ->
    if typeof json == 'string'
      @json = JSON.parse json
    else
      @json = json

    @schema = undefined
    @properties = properties || new SchemaProperties {}

  generate: () ->
    getSchemaForObjectProperties = {
      baseObject: @json,
      objectId: undefined,
      firstLevel: true,
      properties: @properties
    }
    return @schema = @getSchemaForObject getSchemaForObjectProperties

  #@private
  getSchemaTypeFor: (val) ->
    if @isArray val then return 'array'

    type = typeof val

    if type is 'undefined' then return 'null'
    if type is 'number' and val % 1 == 0 then return 'integer'

    return type

  #@private
  isBaseType: (type) ->
    return !(type in ["array", "object"])

  #@private
  getSchemaForObject: ({baseObject, objectId, firstLevel, properties}) ->
    if firstLevel is undefined then firstLevel = true

    properties ||= new SchemaProperties
    schemaDict = {}

    if firstLevel
      schemaDict["$schema"] = SCHEMA_VERSION
      schemaDict["id"] = "#"
      if typeof(baseObject) == 'object' and Object.keys(baseObject).length == 0
        schemaDict["empty"] = true

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
        getSchemaForObjectProperties = {
          baseObject: value,
          objectId: prop,
          firstLevel: false,
          properties: properties
        }
        schemaDict["properties"][prop] = @getSchemaForObject getSchemaForObjectProperties

    else if schemaType is 'array' and baseObject.length > 0

      schemaDict['items'] = []
      counter = 0

      for item in baseObject
        getSchemaForObjectProperties = {
          baseObject: item,
          objectId: counter,
          firstLevel: false,
          properties: properties
        }
        schemaDict['items'].push(@getSchemaForObject getSchemaForObjectProperties)
        counter += 1

    return schemaDict

  #@private
  isArray: (object) ->
    return object instanceof Array

module.exports = {
  SchemaProperties,
  SchemaGenerator
}
