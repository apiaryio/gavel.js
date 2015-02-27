#@private
SCHEMA_VERSION = "http://json-schema.org/draft-04/schema#"

# Configuration structure container for SchemaGenerator
# @author Peter Grilli <tully@apiary.io>
class SchemaV4Properties

  # Construct a SchemaProperties
  #@option {} [Boolean] keysStrict if true - no additional properties are allowed
  #@option {} [Boolean] valuesStrict if true - values will be presented as enums in schema
  #@option {} [Boolean] typesStrict if true - "type" property according to the value in source json will be generated in schema
  constructor: ({keysStrict, valuesStrict, typesStrict}) ->
    @set {keysStrict: keysStrict || false, valuesStrict: valuesStrict || false, typesStrict: typesStrict || false}

  # Sets a SchemaProperties instance attributes
  #@option {} [Boolean] keysStrict if true - no additional properties are allowed
  #@option {} [Boolean] valuesStrict if true - values will be presented as enums in schema
  #@option {} [Boolean] typesStrict if true - "type" property according to the value in source json will be generated in schema
  set: ({keysStrict, valuesStrict, typesStrict}) ->
    @.keysStrict   = keysStrict
    @.valuesStrict = valuesStrict
    @.typesStrict  = typesStrict

# From given JSON or object, construct JSON schema for validation (using TV4)
# @author Peter Grilli <tully@apiary.io>
class SchemaV4Generator
  # Construct a SchemaGenerator
  #@option {} [Object] json source json from which the schema will be generated
  #@option {} [SchemaProperties] properties see {SchemaProperties}
  constructor: ( {json, properties} ) ->
    if typeof json == 'string'
      @json = JSON.parse json
    else
      @json = json

    @schema = undefined
    @properties = properties || new SchemaV4Properties {}

    # for handling strict values array as caseless
    if Array.isArray @properties.valuesStrict
      lowercased = []
      for val in @properties.valuesStrict
        lowercased.push val.toLowerCase()
      @properties.valuesStrict = lowercased

  #generates json schema
  #@return [Object] generated json schema
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

    if ((type is 'undefined') or not val?) then return 'null'
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
      if (baseObject instanceof Object) and Object.keys(baseObject).length == 0
        schemaDict["empty"] = true

    if objectId isnt undefined
      schemaDict["id"] = objectId

    schemaType = @getSchemaTypeFor baseObject

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

    if properties.valuesStrict is true and @isBaseType schemaType
      schemaDict['enum'] = [baseObject]

    else if Array.isArray(properties.valuesStrict) and @isBaseType schemaType
      if properties.valuesStrict.indexOf(objectId?.toLowerCase()) > -1
        schemaDict['enum'] = [baseObject]

    if (properties.typesStrict and @isBaseType schemaType) or (not @isBaseType schemaType) or firstLevel == true
      schemaDict["type"] = schemaType

    if schemaType is 'object' and Object.keys(baseObject).length > 0
      schemaDict["properties"] = {}
      schemaDict["required"] = []
      for prop, value of baseObject
        getSchemaForObjectProperties = {
          baseObject: value,
          objectId: prop,
          firstLevel: false,
          properties: properties
        }
        schemaDict["properties"][prop] = @getSchemaForObject getSchemaForObjectProperties
        schemaDict["required"].push prop
    else if schemaType is 'array' and baseObject.length > 0

      schemaDict['items'] = []
      counter = 0

      for item in baseObject
        getSchemaForObjectProperties = {
          baseObject: item,
          objectId: counter.toString(),
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
  SchemaV4Properties,
  SchemaV4Generator
}
