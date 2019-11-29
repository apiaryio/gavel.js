const clone = require('clone');

const errors = require('../errors');
const { JsonSchemaLegacy } = require('./json-schema-legacy');
const {
  SchemaV4Generator,
  SchemaV4Properties
} = require('../utils/schema-v4-generator');
const tv4ToHeadersMessage = require('../utils/tv4-to-headers-message');

const resolveHeaders = (headers) => {
  if (typeof headers !== 'object') {
    return headers;
  }

  const transformedHeaders = Object.keys(headers).reduce((acc, key) => {
    return Object.assign({}, acc, { [key.toLowerCase()]: headers[key] });
  }, {});

  return transformedHeaders;
};

const getSchema = (json) => {
  const properties = new SchemaV4Properties({
    keysStrict: false,
    typesStrict: false,
    valuesStrict: [
      'content-type',
      'accept',
      'accept-charset',
      'accept-encoding',
      'accept-language'
    ]
  });

  const schemaGenerator = new SchemaV4Generator({ json, properties });
  return schemaGenerator.generate();
};

class HeadersJsonExample extends JsonSchemaLegacy {
  constructor(expected) {
    if (typeof expected !== 'object') {
      throw new errors.MalformedDataError('Expected is not an Object');
    }

    const resolvedExpected = resolveHeaders(expected);
    const resolvedJsonSchema = getSchema(resolvedExpected);

    if (resolvedJsonSchema && resolvedJsonSchema.properties) {
      const skippedHeaders = ['date', 'expires'];
      skippedHeaders.forEach((headerName) => {
        if (resolvedJsonSchema.properties[headerName]) {
          delete resolvedJsonSchema.properties[headerName].enum;
        }
      });
    }

    super(resolvedJsonSchema);

    this.expected = resolvedExpected;
    this.jsonSchema = resolvedJsonSchema;
  }

  validate(data) {
    if (typeof data !== 'object') {
      throw new errors.MalformedDataError('Actual is not an Object');
    }

    const resolvedData = resolveHeaders(data);
    const results = super.validate(resolvedData);

    if (results.length > 0) {
      const resultCopy = clone(results, false);

      for (let i = 0; i < results.length; i++) {
        resultCopy[i].message = tv4ToHeadersMessage(
          resultCopy[i].message,
          this.expected
        );
      }

      return resultCopy;
    }

    return results;
  }
}

module.exports = {
  HeadersJsonExample
};
