const Ajv = require('ajv');
const tv4 = require('tv4');

const metaSchemaV6 = require('ajv/lib/refs/json-schema-draft-06.json');
const metaSchemaV7 = require('ajv/lib/refs/json-schema-draft-07.json');

const metaSchemaV4 = require('../meta-schema-v4');
const errors = require('../errors');
const parseJson = require('../utils/parseJson');

const SCHEMA_VERSIONS = {
  draftV4: 'http://json-schema.org/draft-04/schema',
  draftV6: 'http://json-schema.org/draft-06/schema',
  draftV7: 'http://json-schema.org/draft-07/schema'
};

const META_SCHEMA = {
  draftV4: metaSchemaV4,
  draftV6: metaSchemaV6,
  draftV7: metaSchemaV7
};

const last = (list) => {
  return list[list.length - 1];
};

/**
 * Returns a JSON Schema Draft version of the given JSON Schema.
 */
const getExplicitSchemaVersion = (jsonSchema) => {
  const currentVersion = jsonSchema.$schema && jsonSchema.$schema;
  return Object.keys(SCHEMA_VERSIONS).find((version) => {
    const jsonSchemaAnnotation = SCHEMA_VERSIONS[version];
    return currentVersion && currentVersion.includes(jsonSchemaAnnotation);
  });
};

const getImplicitSchemaVersion = (jsonSchema) => {
  // A single boolean value is a valid JSON Schema Draft 7
  if (typeof jsonSchema === 'boolean') {
    return 'draftV7';
  }
};

/**
 * @deprecate
 * Attempts to resolve a schema version for a JSON Schema
 * without the explicit version.
 */
const getImplicitLegacySchemaVersion = (jsonSchema) => {
  const [schemaVersion] = [['draftV4', metaSchemaV4]].find(
    ([_, metaSchema]) => {
      tv4.reset();
      tv4.addSchema('', metaSchema);
      tv4.addSchema(metaSchema.$schema, metaSchema);
      const validationResult = tv4.validateResult(jsonSchema, metaSchema);
      return validationResult.valid;
    }
  ) || [null, null];

  return schemaVersion;
};

const getSchemaVersion = (jsonSchema) => {
  return (
    getExplicitSchemaVersion(jsonSchema) ||
    getImplicitSchemaVersion(jsonSchema) ||
    getImplicitLegacySchemaVersion(jsonSchema)
  );
};

class JsonSchemaValidator {
  constructor(jsonSchema) {
    this.jsonSchema = this.resolveJsonSchema(jsonSchema);
    this.jsonSchemaVersion = getSchemaVersion(this.jsonSchema);

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
   * Resolve stringified JSON Schema to an Object.
   * Prevents invalid JSON to be consumed by a validator.
   */
  resolveJsonSchema(jsonSchema) {
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
    const ajv = new Ajv({
      // In order to use AJV with draft-4 and draft-6/7
      // provide the "auto" value to "schemaId".
      schemaId: 'auto'
    });

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
      // Enable for error messages to include enum violations.
      allErrors: true,
      // Enalbe verbose mode for error messages to include
      // the actual values in `error[n].data`.
      verbose: true,
      // Disable adding JSON Schema Draft 7 meta schema by default.
      // Allows to always add a meta schema depending on the schema version.
      meta: false,
      // No need to validate schema again, already validated
      // in "validateSchema()" method. Once AJV is the only validator
      // it would make sense to remove the custom schema validation method
      // and use this built-in behavior instead.
      validateSchema: false,
      jsonPointers: true
    });

    ajv.validate(this.jsonSchema, parsedData);

    // Convert AJV validation errors to the Gavel public validation errors.
    return (ajv.errors || []).map((ajvError) => {
      const { missingProperty } = ajvError.params;

      const pointer = ajvError.dataPath.concat(
        // Handle root-level pointers.
        // AJV returns an empty `dataPath` when a root-level property
        // rejects. TV4, however, used to return a pointer to a root-level
        // property regardless. Keep backward-compatibility.
        missingProperty ? ['/', missingProperty].join('') : ''
      );

      // Property is pretty much 1-1 representation of the pointer
      // stored in the list of strings.
      const property = pointer.split('/').filter(Boolean);

      const errorMessage = this.getBackwardCompatibleErrorMessage(
        ajv,
        ajvError,
        pointer,
        property
      );

      return {
        message: errorMessage,
        location: {
          pointer,
          property
        }
      };
    });
  }

  /**
   * @deprecate
   * Coerces AJV validation error message to the error message
   * previously produced by Amanda/TV4 for backward-compatibility.
   */
  getBackwardCompatibleErrorMessage(ajv, ajvError, pointer, property) {
    const { keyword, data, params } = ajvError;

    switch (keyword) {
      case 'type':
        return `At '${pointer}' Invalid type: ${typeof data} (expected ${
          params.type
        })`;

      case 'required':
        return `At '${pointer}' Missing required property: ${last(property)}`;

      case 'enum':
        return `At '${pointer}' No enum match for: "${data}"`;

      default:
        return ajv.errorsText([ajvError]);
    }
  }
}

module.exports = {
  JsonSchemaValidator,
  getSchemaVersion,
  META_SCHEMA
};
