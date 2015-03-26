type       = require 'is-type'
stringType = require './get-type'

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
    @set {keysStrict, valuesStrict, typesStrict}

  # Sets a SchemaProperties instance attributes
  #@option {} [Boolean] keysStrict if true - no additional properties are allowed
  #@option {} [Boolean] valuesStrict if true - values will be presented as enums in schema
  #@option {} [Boolean] typesStrict if true - "type" property according to the value in source json will be generated in schema
  set: ({keysStrict, valuesStrict, typesStrict}) ->
    @keysStrict   = keysStrict   ? false
    @valuesStrict = valuesStrict ? false
    @typesStrict  = typesStrict  ? false


# From given JSON or object, construct JSON schema for validation (using TV4)
# @author Peter Grilli <tully@apiary.io>
class SchemaV4Generator
  # Construct a SchemaGenerator
  #@option {} [Object] json source json from which the schema will be generated
  #@option {} [SchemaProperties] properties see {SchemaProperties}
  constructor: ( {json, properties} ) ->
    if type.string(json)
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
    @schema = @getSchemaForObject
      baseObject: @json
      objectId: undefined
      firstLevel: true
      properties: @properties
    return @schema

  #@private
  getSchemaTypeFor: (val) ->
    _type = stringType(val)

    if not val?
      return 'null'
    if _type is 'array'
      return 'array'
    if _type is 'number' and val % 1 == 0
      return 'integer'

    return _type

  #@private
  isBaseType: (_type) ->
    return _type not in ["array", "object"]

  #@private
  getSchemaForObject: ({baseObject, objectId, firstLevel, properties}) ->
    firstLevel ?= true
    hasKeys = false

    properties ||= new SchemaProperties
    schemaDict = {}

    if firstLevel
      schemaDict["$schema"] = SCHEMA_VERSION
      schemaDict["id"] = "#"

    if objectId?
      schemaDict["id"] = objectId

    schemaType = @getSchemaTypeFor baseObject

    if type.object(baseObject)
      for own k,v of baseObject
        hasKeys = true
        break
      if not hasKeys
        schemaDict["empty"] = true

    if schemaType is 'object'
      if properties.keysStrict
        schemaDict['additionalProperties'] = false
      else
        schemaDict['additionalProperties'] = true

    else if schemaType is 'array'
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

    if schemaType is 'object' and hasKeys
      schemaDict["required"] = []
      schemaDict["properties"] = {}
      for own prop, value of baseObject
        getSchemaForObjectProperties =
          baseObject: value
          objectId: prop
          firstLevel: false
          properties: properties
        schemaDict["properties"][prop] = @getSchemaForObject getSchemaForObjectProperties
        schemaDict["required"].push prop

    else if schemaType is 'array' and baseObject.length > 0

      schemaDict['items'] = []

      for item, itemIndex in baseObject
        getSchemaForObjectProperties =
          baseObject: item
          objectId: itemIndex.toString()
          firstLevel: false
          properties: properties
        schemaDict['items'].push(@getSchemaForObject getSchemaForObjectProperties)

    return schemaDict

module.exports = {
  SchemaV4Properties,
  SchemaV4Generator
}
