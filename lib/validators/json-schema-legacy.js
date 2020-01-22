const amanda = require('amanda');
const tv4 = require('tv4');
const jsonPointer = require('json-pointer');

const { JsonSchemaValidator, META_SCHEMA } = require('./json-schema-next');
const { ValidationErrors } = require('./validation-errors');
const toGavelResult = require('../utils/to-gavel-result');
const deprecated = require('../utils/deprecated');

/**
 * Returns a proper article for a given string.
 * @param {string} str
 * @returns {string}
 */
function getArticle(str) {
  return ['a', 'e', 'i', 'o', 'u'].includes(str.toLowerCase()) ? 'an' : 'a';
}

const jsonSchemaOptions = {
  singleError: false,
  messages: {
    minLength: (prop, val, validator) =>
      `The ${prop} property must be at least ${validator} characters long (currently ${val.length} characters long).`,
    maxLength: (prop, val, validator) =>
      `The ${prop} property must not exceed ${validator} characters (currently${val.length} characters long).`,
    length: (prop, val, validator) =>
      `The ${prop} property must be exactly ${validator} characters long (currently ${val.length} characters long).`,
    format: (prop, val, validator) =>
      `The ${prop} property must be ${getArticle(
        validator[0]
      )} ${validator} (current value is ${JSON.stringify(val)}).`,
    type: (prop, val, validator) =>
      `The ${prop} property must be ${getArticle(
        validator[0]
      )} ${validator} (current value is ${JSON.stringify(val)})."`,
    except: (prop, val) => `The ${prop} property must not be ${val}.`,
    minimum: (prop, val, validator) =>
      `The minimum value of the ${prop} must be ${validator} (current value is ${JSON.stringify(
        val
      )}).`,
    maximum: (prop, val, validator) =>
      `The maximum value of the ${prop} must be ${validator} (current value is ${JSON.stringify(
        val
      )}).`,
    pattern: (prop, val, validator) =>
      `The ${prop} value (${val}) does not match the ${validator} pattern.`,
    maxItems: (prop, val, validator) =>
      `The ${prop} property must not contain more than ${validator} items (currently contains ${val.length} items).`,
    minItems: (prop, val, validator) =>
      `The ${prop} property must contain at least ${validator} items (currently contains ${val.length} items).`,
    divisibleBy: (prop, val, validator) =>
      `The ${prop} property is not divisible by ${validator} (current value is ${JSON.stringify(
        val
      )}).`,
    uniqueItems: (prop) => `All items in the ${prop} property must be unique.`
  }
};

class JsonSchemaLegacy extends JsonSchemaValidator {
  validateSchema() {
    const { jsonSchema, jsonMetaSchema } = this;

    // In case schema version is unidentified,
    // assume JSON Schema Draft V3.
    const metaSchema = jsonMetaSchema || META_SCHEMA.draftV3;

    tv4.reset();
    tv4.addSchema('', metaSchema);
    tv4.addSchema(metaSchema.$schema, metaSchema);
    const validationResult = tv4.validateResult(jsonSchema, metaSchema);

    return validationResult.valid;
  }

  validate(data) {
    const parsedData = this.parseData(data);

    switch (this.jsonSchemaVersion) {
      case 'draftV3':
        deprecated(
          'JSON Schema Draft V3 is deprecated. Please use a newer version of JSON Schema (Draft V4-7).'
        );

        return this.validateUsingAmanda(parsedData);
      case 'draftV4':
        return this.validateUsingTV4(parsedData);
      default:
        throw new Error(
          `Attempted to use JsonSchemaLegacy on non-legacy JSON Schema ${this.jsonSchemaVersion}!`
        );
    }
  }

  validateUsingAmanda(data) {
    let errors = {
      length: 0,
      errorMessages: {}
    };

    try {
      amanda.validate(data, this.jsonSchema, jsonSchemaOptions, (error) => {
        if (error && error.length > 0) {
          for (let i = 0; i < error.length; i++) {
            if (error[i].property === '') {
              error[i].property = [];
            }
          }

          errors = new ValidationErrors(error);
        }
      });
    } catch (internalError) {
      errors = new ValidationErrors({
        '0': {
          property: [],
          attributeValue: true,
          message: `Validator internal error: ${internalError.message}`,
          validatorName: 'error'
        },
        length: 1,
        errorMessages: {}
      });
    }

    return toGavelResult(errors);
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
