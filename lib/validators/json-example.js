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
   * @throw {MalformedDataError} when real is not a String or when no schema provided and expected is not a String
   * @throw {SchemaNotJsonParsableError} when given schema is not a json parsable string or valid json
   * @throw {NotEnoughDataError} when at least one of expected data and json schema is not given
   */
  constructor(real, expected) {
    if (typeof real !== 'string') {
      const outError = new errors.MalformedDataError(
        'JsonExample validator: provided real data is not string'
      );
      outError.data = real;
      throw outError;
    }

    if (typeof expected !== 'string') {
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
