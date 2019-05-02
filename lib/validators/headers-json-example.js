const clone = require('clone');

const errors = require('../errors');
const { JsonSchema } = require('./json-schema');
const {
  SchemaV4Generator,
  SchemaV4Properties
} = require('../utils/schema-v4-generator');
const tv4ToHeadersMessage = require('../utils/tv4-to-headers-message');

const prepareHeaders = (headers) => {
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

class HeadersJsonExample extends JsonSchema {
  constructor(real, expected) {
    if (typeof real !== 'object') {
      throw new errors.MalformedDataError('Real is not an Object');
    }

    if (typeof expected !== 'object') {
      throw new errors.MalformedDataError('Expected is not an Object');
    }

    const preparedExpected = prepareHeaders(expected);
    const preparedReal = prepareHeaders(real);
    const preparedSchema = getSchema(preparedExpected);

    if (preparedSchema && preparedSchema.properties) {
      const skippedHeaders = ['date', 'expires'];
      skippedHeaders.forEach((headerName) => {
        if (preparedSchema.properties[headerName]) {
          delete preparedSchema.properties[headerName].enum;
        }
      });
    }

    super(preparedReal, preparedSchema);

    this.expected = preparedExpected;
    this.real = preparedReal;
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
