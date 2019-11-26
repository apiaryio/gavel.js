const Ajv = require('ajv');
const metaSchemaV6 = require('ajv/lib/refs/json-schema-draft-06.json');
const metaSchemaV7 = require('ajv/lib/refs/json-schema-draft-07.json');

const metaSchemaV4 = require('../meta-schema-v4');
const metaSchemaV3 = require('../meta-schema-v3');
const errors = require('../errors');

const SCHEMA_VERSIONS = {
  v3: 'http://json-schema.org/draft-03/schema',
  v4: 'http://json-schema.org/draft-04/schema',
  v6: 'http://json-schema.org/draft-06/schema',
  v7: 'http://json-schema.org/draft-07/schema'
};

const META_SCHEMA = {
  v3: metaSchemaV3,
  v4: metaSchemaV4,
  v6: metaSchemaV6,
  v7: metaSchemaV7
};

/**
 * Returns a JSON Schema Draft version of the given JSON Schema.
 */
const getSchemaVersion = (jsonSchema) => {
  const jsonSchemaVersion = Object.keys(SCHEMA_VERSIONS).find((version) => {
    const jsonSchemaAnnotation = SCHEMA_VERSIONS[version];
    return (
      jsonSchema.$schema && jsonSchema.$schema.includes(jsonSchemaAnnotation)
    );
  });

  if (jsonSchemaVersion == null) {
    throw new errors.JsonSchemaNotSupported(
      `Provided JSON Schema version is missing, or not supported. Please provide a JSON Schema Draft ${Object.keys(
        SCHEMA_VERSIONS
      ).join('/')}.`
    );
  }

  return jsonSchemaVersion;
};

class JsonSchemaValidator {
  constructor(jsonSchema) {
    this.jsonSchema = jsonSchema;
    this.jsonSchemaVersion = getSchemaVersion(jsonSchema);
    this.jsonMetaSchema = this.getMetaSchema();

    const isSchemaValid = this.validateSchema();
    if (!isSchemaValid) {
      throw new errors.JsonSchemaNotValid(
        `Provided JSON Schema is not a valid JSON Schema Draft ${this.jsonSchemaVersion}.`
      );
    }
  }

  /**
   * Returns a meta schema for the provided JSON Schema.
   */
  getMetaSchema() {
    return META_SCHEMA[this.jsonSchemaVersion];
  }

  /**
   * Validates the schema against its version specification.
   * @return {boolean}
   */
  validateSchema() {
    const { jsonSchemaVersion, jsonSchema } = this;
    let isSchemaValid = true;

    // use AJV to validate modern schema (6/7)
    const ajv = new Ajv();

    const metaSchema = META_SCHEMA[jsonSchemaVersion];
    ajv.addMetaSchema(metaSchema, 'meta');

    isSchemaValid = ajv.validateSchema(jsonSchema);

    // Clean up the added meta schema
    ajv.removeSchema('meta');

    return isSchemaValid;
  }

  /**
   * Validates the given data.
   */
  validate(data) {
    const ajv = new Ajv({
      // Disable adding JSON Schema Draft 7 meta schema by default.
      // Allows to always add a meta schema depending on the schema version.
      meta: false,
      // No need to validate schema again, already validated
      // in "validateSchema()" method.
      validateSchema: false,
      // Make AJV point to the property in "error.dataPath",
      // so it could be used as a complete pointer.
      // errorDataPath: 'property',
      jsonPointers: true
    });

    ajv.validate(this.jsonSchema, data);

    // Convert AJV validation errors to the Gavel public validation errors.
    return (ajv.errors || []).map((ajvError) => {
      const errorMessage = ajv.errorsText([ajvError]);
      const { dataPath: pointer } = ajvError;
      const property =
        ajvError.params.missingProperty || pointer.split('/').filter(Boolean);

      return {
        message: errorMessage,
        location: {
          pointer,
          property
        }
      };
    });
  }
}

module.exports = {
  JsonSchemaValidator,
  getSchemaVersion,
  META_SCHEMA
};
