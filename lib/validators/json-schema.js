const { JsonSchemaLegacy } = require('./json-schema-legacy');
const { JsonSchemaValidator, getSchemaVersion } = require('./json-schema-next');
const errors = require('../errors');
const parseJson = require('../utils/parseJson');

/**
 * Resolve stringified JSON Schema to an Object.
 * Validate invalid JSON Schema.
 */
function resolveJsonSchema(jsonSchema) {
  let resolvedJsonSchema = jsonSchema;

  if (typeof jsonSchema === 'string') {
    try {
      resolvedJsonSchema = parseJson(jsonSchema);
    } catch (error) {
      const unparsableJsonSchemaError = new errors.SchemaNotJsonParsableError(
        `Given JSON Schema is not a valid JSON. ${error.message}`
      );
      unparsableJsonSchemaError.schema = jsonSchema;
      throw unparsableJsonSchemaError;
    }
  }

  return resolvedJsonSchema;
}

class JsonSchema {
  constructor(jsonSchema) {
    const resolvedJsonSchema = resolveJsonSchema(jsonSchema);
    const jsonSchemaVersion = getSchemaVersion(resolvedJsonSchema);
    const isLegacySchema = ['draftV4'].includes(jsonSchemaVersion);

    // Instantiate different JSON Schema validators
    // based on the JSON Schema Draft version.
    // Both validators have the same API.
    return isLegacySchema
      ? new JsonSchemaLegacy(resolvedJsonSchema)
      : new JsonSchemaValidator(resolvedJsonSchema);
  }
}

module.exports = {
  JsonSchema
};
