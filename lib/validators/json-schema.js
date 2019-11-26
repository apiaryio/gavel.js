const { JsonSchemaLegacy } = require('./json-schema-legacy');
const { JsonSchemaValidator, getSchemaVersion } = require('./json-schema-next');

class JsonSchema {
  constructor(jsonSchema) {
    const jsonSchemaVersion = getSchemaVersion(jsonSchema);
    const isLegacy = ['v3', 'v4'].includes(jsonSchemaVersion);

    // Instantiate different JSON Schema validators
    // based on the JSON Schema Draft version.
    // Both validators have the same API.
    return isLegacy
      ? new JsonSchemaLegacy(jsonSchema)
      : new JsonSchemaValidator(jsonSchema);
  }
}

module.exports = {
  JsonSchema
};
