const tv4 = require('tv4');
const jsonPointer = require('json-pointer');

const { JsonSchemaValidator, META_SCHEMA } = require('./json-schema-next');
const { ValidationErrors } = require('./validation-errors');
const toGavelResult = require('../utils/to-gavel-result');

class JsonSchemaLegacy extends JsonSchemaValidator {
  validateSchema() {
    const { jsonSchema, jsonMetaSchema } = this;

    // Set the default JSON Schema version if no explicit
    // version is provided.
    const metaSchema = jsonMetaSchema || META_SCHEMA.draftV4;

    tv4.reset();
    tv4.addSchema('', metaSchema);
    tv4.addSchema(metaSchema.$schema, metaSchema);
    const validationResult = tv4.validateResult(jsonSchema, metaSchema);

    return validationResult.valid;
  }

  validate(data) {
    const parsedData = this.parseData(data);

    switch (this.jsonSchemaVersion) {
      case 'draftV4':
        return this.validateUsingTV4(parsedData);
      default:
        throw new Error(
          `Attempted to use JsonSchemaLegacy on non-legacy JSON Schema ${this.jsonSchemaVersion}!`
        );
    }
  }

  validateUsingTV4(data) {
    const result = tv4.validateMultiple(data, this.jsonSchema);
    const validationErrors = result.errors.concat(result.missing);

    const amandaCompatibleError = {
      length: validationErrors.length,
      errorMessages: {}
    };

    for (let index = 0; index < validationErrors.length; index++) {
      const validationError = validationErrors[index];
      let error;

      if (validationError instanceof Error) {
        error = validationError;
      } else {
        error = new Error('Missing schema');
        error.params = { key: validationError };
        error.dataPath = '';
      }

      const pathArray = jsonPointer
        .parse(error.dataPath)
        .concat(error.params.key || []);
      const pointer = jsonPointer.compile(pathArray);

      amandaCompatibleError[index] = {
        message: `At '${pointer}' ${error.message}`,
        property: pathArray,
        attributeValue: true,
        validatorName: 'error'
      };
    }

    const errors = new ValidationErrors(amandaCompatibleError);
    return toGavelResult(errors);
  }
}

module.exports = { JsonSchemaLegacy };
