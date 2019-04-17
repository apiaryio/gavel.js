const type = require('is-type');

const errors = require('../errors');
const { JsonSchema } = require('./json-schema');
const {
  SchemaV4Generator,
  SchemaV4Properties
} = require('../utils/schema-v4-generator');

function getSchema(json) {
  const properties = new SchemaV4Properties({
    keysStrict: false,
    valuesStrict: false,
    typesStrict: false
  });
  const schemaGenerator = new SchemaV4Generator({ json, properties });
  return schemaGenerator.generate();
}

class JsonExample extends JsonSchema {
  /**
   * Construct a BodyValidator, check data and choose the right validator.
   * If real and expected data are valid JSON, and a valid schema is given,
   * choose JsonValidator, otherwise choose StringValidator.
   * @param {string} real
   * @param {string} expected
   */
  constructor(real, expected) {
    if (!type.string(real)) {
      const outError = new errors.MalformedDataError(
        'JsonExample validator: provided real data is not string'
      );
      outError.data = real;
      throw outError;
    }

    if (!type.string(expected)) {
      const outError = new errors.MalformedDataError(
        'JsonExample validator: provided expected data is not string'
      );
      outError.data = expected;
      throw outError;
    }

    const schema = getSchema(expected);
    super(real, schema);
  }
}

module.exports = {
  JsonExample
};
