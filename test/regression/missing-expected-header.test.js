const { expect } = require('../chai');
const { validate } = require('../../lib/validate');

describe('Regression: Missing expected header', () => {
  const actualResponse = {
    method: 'POST',
    headers: {
      host: 'private-54408-mynotesapi.apiary-mock.test:8001',
      'content-length': '27',
      connection: 'keep-alive'
    },
    body: '{"id":2,"title":"Buy milk"}'
  };
  const result = validate(
    {
      method: 'POST',
      headers: {},
      body: '',
      headersSchema: null,
      bodySchema: null
    },
    actualResponse
  );

  it('should contain "headers.values.expected" as empty Object', () => {
    expect(result.fields.headers.values.expected).to.deep.equal({});
  });

  it('should contain "headers.values.actual"', () => {
    expect(result.fields.headers.values.actual).to.deep.equal(
      actualResponse.headers
    );
  });
});
