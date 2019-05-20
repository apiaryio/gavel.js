const clone = require('clone');

const {
  normalizeHeaders
} = require('../next/units/normalize/normalizeHeaders');
const errors = require('../errors');
const { JsonSchema } = require('./json-schema');
const {
  SchemaV4Generator,
  SchemaV4Properties
} = require('../utils/schema-v4-generator');
const tv4ToHeadersMessage = require('../utils/tv4-to-headers-message');

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

class HeadersJsonExample extends JsonSchema {
  constructor(realHeaders, expectedHeaders) {
    if (typeof realHeaders !== 'object') {
      throw new errors.MalformedDataError('Real is not an Object');
    }

    if (typeof expectedHeaders !== 'object') {
      throw new errors.MalformedDataError('Expected is not an Object');
    }

    // It's debatable whether the validation should perform any normalization.
    // Input HTTP messages are normalized at highest level, thus
    // validators should assume they are operating on normalized data.
    // TODO: Fix tests to use/assert lowecase header names.
    const normalizedReal = normalizeHeaders(realHeaders);
    const normalizedExpected = normalizeHeaders(expectedHeaders);
    const preparedSchema = getSchema(normalizedExpected);

    if (preparedSchema && preparedSchema.properties) {
      const skippedHeaders = ['date', 'expires'];
      skippedHeaders.forEach((headerName) => {
        if (preparedSchema.properties[headerName]) {
          delete preparedSchema.properties[headerName].enum;
        }
      });
    }

    super(normalizedReal, preparedSchema);

    this.expected = normalizedExpected;
    this.real = normalizedReal;
    this.schema = preparedSchema;
  }

  validate() {
    const result = super.validate();

    if (result.length > 0) {
      const resultCopy = clone(result, false);

      for (let i = 0; i < result.length; i++) {
        resultCopy[i].message = tv4ToHeadersMessage(
          resultCopy[i].message,
          this.expected
        );
      }

      return resultCopy;
    }

    return result;
  }
}

module.exports = {
  HeadersJsonExample
};
