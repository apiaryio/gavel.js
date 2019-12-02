const Ajv = require('ajv');
const tv4 = require('tv4');

const metaSchemaV6 = require('ajv/lib/refs/json-schema-draft-06.json');
const metaSchemaV7 = require('ajv/lib/refs/json-schema-draft-07.json');

const metaSchemaV4 = require('../meta-schema-v4');
const metaSchemaV3 = require('../meta-schema-v3');
const errors = require('../errors');
const parseJson = require('../utils/parseJson');

const SCHEMA_VERSIONS = {
  draftV3: 'http://json-schema.org/draft-03/schema',
  draftV4: 'http://json-schema.org/draft-04/schema',
  draftV6: 'http://json-schema.org/draft-06/schema',
  draftV7: 'http://json-schema.org/draft-07/schema'
};

const META_SCHEMA = {
  draftV3: metaSchemaV3,
  draftV4: metaSchemaV4,
  draftV6: metaSchemaV6,
  draftV7: metaSchemaV7
};

/**
 * Returns a JSON Schema Draft version of the given JSON Schema.
 */
const getSchemaVersion = (jsonSchema) => {
  const currentVersion = jsonSchema.$schema && jsonSchema.$schema;
  return Object.keys(SCHEMA_VERSIONS).find((version) => {
    const jsonSchemaAnnotation = SCHEMA_VERSIONS[version];
    return currentVersion && currentVersion.includes(jsonSchemaAnnotation);
  });
};

/**
 * @deprecate
 * Attempts to resolve a schema version for a JSON Schema
 * without the explicit version.
 */
const getImplicitSchemaVersion = (jsonSchema) => {
  const [schemaVersion] = [
    ['draftV3', metaSchemaV3],
    ['draftV4', metaSchemaV4]
  ].find(([_, metaSchema]) => {
    tv4.reset();
    tv4.addSchema('', metaSchema);
    tv4.addSchema(metaSchema.$schema, metaSchema);
    const validationResult = tv4.validateResult(jsonSchema, metaSchema);
    return validationResult.valid;
  }) || [null, null];

  return schemaVersion;
};

class JsonSchemaValidator {
  constructor(jsonSchema) {
    this.jsonSchema = jsonSchema;
    this.jsonSchemaVersion =
      getSchemaVersion(this.jsonSchema) ||
      getImplicitSchemaVersion(this.jsonSchema);

    if (this.jsonSchemaVersion == null) {
      const supportedVersions = Object.keys(SCHEMA_VERSIONS).join('/');

      // Including all supported JSON Schema versions (even legacy)
      // so that derived JsonSchemaLegacy class doesn't have to duplicate
      // this version existence check.
      throw new errors.JsonSchemaNotSupported(
        `Expected a supported version of JSON Schema (${supportedVersions}).`
      );
    }

    this.jsonMetaSchema = this.getMetaSchema();

    const isSchemaValid = this.validateSchema();
    if (!isSchemaValid) {
      throw new errors.JsonSchemaNotValid(
        `Provided JSON Schema is not a valid JSON Schema ${this.jsonSchemaVersion}.`
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
    const ajv = new Ajv();

    const metaSchema = META_SCHEMA[jsonSchemaVersion];
    ajv.addMetaSchema(metaSchema, 'meta');

    const isSchemaValid = ajv.validateSchema(jsonSchema);

    // Clean up the added meta schema
    ajv.removeSchema('meta');

    return isSchemaValid;
  }

  parseData(data) {
    let resolvedData = data;

    if (typeof data === 'string') {
      try {
        resolvedData = parseJson(data);
      } catch (error) {
        const dataError = new errors.DataNotJsonParsableError(
          `Expected data to be a valid JSON, but got: ${data}. ${error.message}`
        );
        error.data = data;
        throw dataError;
      }
    }

    return resolvedData;
  }

  /**
   * Validates the given data.
   */
  validate(data) {
    const parsedData = this.parseData(data);

    const ajv = new Ajv({
      // Disable adding JSON Schema Draft 7 meta schema by default.
      // Allows to always add a meta schema depending on the schema version.
      meta: false,
      // No need to validate schema again, already validated
      // in "validateSchema()" method.
      validateSchema: false,
      jsonPointers: true
    });

    ajv.validate(this.jsonSchema, parsedData);

    // Convert AJV validation errors to the Gavel public validation errors.
    return (ajv.errors || []).map((ajvError) => {
      const errorMessage = ajv.errorsText([ajvError]);
      const { dataPath: pointer } = ajvError;

      // When AJV does not return a property name
      // compose it from the pointer.
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
  getImplicitSchemaVersion,
  META_SCHEMA
};
