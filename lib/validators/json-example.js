const { JsonSchemaValidator } = require('./json-schema-next');
const {
  SchemaV4Generator,
  SchemaV4Properties
} = require('../utils/schema-v4-generator');

function generateSchema(json) {
  const properties = new SchemaV4Properties({
    keysStrict: false,
    valuesStrict: false,
    typesStrict: false
  });
  const schemaGenerator = new SchemaV4Generator({ json, properties });
  return schemaGenerator.generate();
}

/**
 * JSON Example validator is a superset of JSON Schema validation
 * that generates a JSON Schema based on the given actual data.
 */
class JsonExample extends JsonSchemaValidator {
  constructor(expected) {
    // Generate JSON Schema from the given expected JSON data.
    const jsonSchema = generateSchema(expected);
    super(jsonSchema);
  }
}

module.exports = {
  JsonExample
};
