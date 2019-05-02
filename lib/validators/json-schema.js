const amanda = require('amanda');
const deepEqual = require('deep-equal');
const tv4 = require('tv4');
const jsonPointer = require('json-pointer');

const metaSchemaV3 = require('../meta-schema-v3');
const metaSchemaV4 = require('../meta-schema-v4');
const errors = require('../errors');
const { ValidationErrors } = require('./validation-errors');

const SCHEMA_V3 = 'http://json-schema.org/draft-03/schema';
const SCHEMA_V4 = 'http://json-schema.org/draft-04/schema';

/**
 * @param {Object} schema
 * @returns {[Object, string] | null} Tuple of [schemaMeta, schemaVersion]
 */
const getSchemaMeta = (schema) => {
  if (schema && schema.$schema && schema.$schema.includes(SCHEMA_V3)) {
    return [metaSchemaV3, 'v3'];
  }

  if (schema && schema.$schema && schema.$schema.includes(SCHEMA_V4)) {
    return [metaSchemaV4, 'v4'];
  }

  return null;
};

/**
 * Returns a proper article for a given string.
 * @param {string} str
 * @returns {string}
 */
function getArticle(str) {
  const vowels = ['a', 'e', 'i', 'o', 'u'];
  return vowels.includes(str.toLowerCase()) ? 'an' : 'a';
}

const jsonSchemaOptions = {
  singleError: false,
  messages: {
    minLength: (prop, val, validator) =>
      `The ${prop} property must be at least ${validator} characters long (currently ${
        val.length
      } characters long).`,
    maxLength: (prop, val, validator) =>
      `The ${prop} property must not exceed ${validator} characters (currently$#{val.length} characters long).`,
    length: (prop, val, validator) =>
      `The ${prop} property must be exactly ${validator} characters long (currently ${
        val.length
      } characters long).`,
    format: (prop, val, validator) =>
      `The ${prop} property must be ${getArticle(
        validator[0]
      )} ${validator} (current value is ${JSON.stringify(val)}).`,
    type: (prop, val, validator) =>
      `The ${prop} property must be ${getArticle(
        validator[0]
      )} ${validator} (current value is ${JSON.stringify(val)})."`,
    except: (prop, val, validator) =>
      `The ${prop} property must not be ${val}.`,
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
      `The ${prop} property must not contain more than ${validator} items (currently contains ${
        val.length
      } items).`,
    minItems: (prop, val, validator) =>
      `The ${prop} property must contain at least ${validator} items (currently contains ${
        val.length
      } items).`,
    divisibleBy: (prop, val, validator) =>
      `The ${prop} property is not divisible by ${validator} (current value is ${JSON.stringify(
        val
      )}).`,
    uniqueItems: (prop, val, validator) =>
      `All items in the ${prop} property must be unique.`
  }
};

class JsonSchema {
  /**
   * Constructs a JsonValidator and validates given data.
   * @param {Object | string} data
   * @param {Object | string} schema
   */
  constructor(data, schema) {
    this.data = data;
    this.schema = schema;

    if (typeof this.data === 'string') {
      try {
        this.data = JSON.parse(this.data);
      } catch (error) {
        const outError = new errors.DataNotJsonParsableError(
          'JSON validator: body: ' + error.message
        );
        outError.data = this.data;
        throw outError;
      }
    }

    if (typeof this.schema === 'string') {
      try {
        this.schema = JSON.parse(this.schema);
      } catch (error) {
        const outError = new errors.SchemaNotJsonParsableError(
          'JSON validator: schema: ' + error.message
        );
        outError.schema = this.schema;
        throw outError;
      }
    }

    this.jsonSchemaVersion = null;
    this.validateSchema();
  }

  validateSchema() {
    const [metaSchema, schemaVersion] = getSchemaMeta(this.schema) || [];

    if (metaSchema) {
      this.jsonSchemaVersion = schemaVersion;

      if (metaSchema.$schema) {
        tv4.reset();
        tv4.addSchema('', metaSchema);
        tv4.addSchema(metaSchema.$schema, metaSchema);
        const validationResult = tv4.validateResult(this.schema, metaSchema);
        if (!validationResult.valid) {
          throw new errors.JsonSchemaNotValid(
            `JSON schema is not valid draft ${this.jsonSchemaVersion}! ${
              validationResult.error.message
            } at path "${validationResult.error.dataPath}"`
          );
        }
      }
    } else {
      if (metaSchemaV3.$schema) {
        tv4.reset();
        tv4.addSchema('', metaSchemaV3);
        tv4.addSchema(metaSchemaV3.$schema, metaSchemaV3);
        const validationResult = tv4.validateResult(this.schema, metaSchemaV3);

        if (validationResult && validationResult.valid) {
          this.jsonSchemaVersion = 'v3';
          return;
        }
      }

      if (metaSchemaV4.$schema) {
        tv4.reset();
        tv4.addSchema('', metaSchemaV4);
        tv4.addSchema(metaSchemaV4.$schema, metaSchemaV4);
        const validationResult = tv4.validateResult(this.schema, metaSchemaV4);

        if (validationResult && validationResult.valid) {
          this.jsonSchemaVersion = 'v4';
          return;
        }
      }

      if (this.jsonSchemaVersion === null) {
        throw new errors.JsonSchemaNotValid(
          'JSON schema is not valid draft v3 or draft v4!'
        );
      }
    }
  }

  validate() {
    if (
      this.data !== null &&
      typeof this.data === 'object' &&
      this.schema.empty
    ) {
      this.output = {
        length: 0,
        errorMessages: {}
      };
      return new ValidationErrors(this.output);
    }

    const hasSameData = deepEqual(this.data, this._dataUsed, { strict: true });
    const hasSameSchema = hasSameData
      ? deepEqual(this.schema, this._schemaUsed, { strict: true })
      : true;

    if (!hasSameData || !hasSameSchema) {
      this.output = this.validatePrivate();
    }

    return this.output;
  }

  validatePrivate() {
    this._dataUsed = this.data;
    this._schemaUsed = this.schema;

    switch (this.jsonSchemaVersion) {
      case 'v3':
        return this.validateSchemaV3();
      case 'v4':
        return this.validateSchemaV4();
      default:
        throw new Error("JSON schema version not identified, can't validate!");
    }
  }

  /**
   * Converts TV4 output to Gavel results.
   */
  evaluateOutputToResults(data) {
    if (!data) {
      data = this.output;
    }

    if (!data) {
      return [];
    }

    const results = Array.from({ length: data.length }, (_, index) => {
      const item = data[index];
      let pathArray = [];

      if (item.property === null) {
        pathArray = [];
      } else if (
        Array.isArray(item.property) &&
        item.property.length === 1 &&
        [null, undefined].includes(item.property[0])
      ) {
        pathArray = [];
      } else {
        pathArray = item.property;
      }

      return {
        pointer: jsonPointer.compile(pathArray),
        message: item.message,
        severity: 'error'
      };
    });

    return results;
  }

  validateSchemaV3() {
    try {
      return amanda.validate(
        this.data,
        this.schema,
        jsonSchemaOptions,
        (error) => {
          if (error && error.length > 0) {
            for (let i = 0; i < error.length; i++) {
              if (error[i].property === '') {
                error[i].property = [];
              }
            }
            this.errors = new ValidationErrors(error);
            return this.errors;
          }
        }
      );
    } catch (error) {
      this.errors = new ValidationErrors({
        '0': {
          property: [],
          attributeValue: true,
          message: `Validator internal error: ${error.message}`,
          validatorName: 'error'
        },
        length: 1,
        errorMessages: {}
      });

      return this.errors;
    }
  }

  validateSchemaV4() {
    const result = tv4.validateMultiple(this.data, this.schema);
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
        property: pathArray,
        attributeValue: true,
        message: `At '${pointer}' ${error.message}`,
        validatorName: 'error'
      };
    }

    this.errors = new ValidationErrors(amandaCompatibleError);
    return this.errors;
  }
}

module.exports = {
  JsonSchema
};
