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
  constructor(expected) {
    // Generate JSON Schema from the given expected JSON data.
    const jsonSchema = getSchema(expected);
    super(jsonSchema);
  }

  /**
   * @throw {MalformedDataError} when actual is not a String or when no schema provided and expected is not a String
   */
  validate(actual) {
    const { jsonSchema: expected } = this;

    console.log(
      'JsonExample: Validating',
      JSON.stringify(actual, null, 2),
      'against',
      JSON.stringify(expected, null, 2)
    );

    if (typeof actual !== 'string') {
      const outError = new errors.MalformedDataError(
        'JsonExample validator: provided actual data is not string'
      );
      outError.data = actual;
      throw outError;
    }

    if (typeof expected !== 'string') {
      const outError = new errors.MalformedDataError(
        'JsonExample validator: provided expected data is not string'
      );
      outError.data = expected;
      throw outError;
    }

    return super.validate(actual);
  }
}

module.exports = {
  JsonExample
};
