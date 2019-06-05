const { assert } = require('chai');
const clone = require('clone');
const { validate } = require('../../lib');

describe('Gavel proxies to functions with callbacks', () => {
  // Examples from README.md
  const baseHttpMessage = {
    statusCode: '200',
    headers: {
      'content-type': 'application/json',
      date: 'Wed, 03 Jul 2013 13:30:53 GMT',
      server: 'gunicorn/0.17.4',
      'content-length': '30',
      connection: 'keep-alive'
    },
    body: '{\n  "origin": "94.113.241.2"\n}'
  };

  const cloneHttpMessage = clone(baseHttpMessage, false);

  const differentHttpMessage = {
    statusCode: '404',
    headers: {
      'content-type': 'application/vnd.gavel.vX+json', // different from baseHttpMessage
      date: 'Wed, 03 Jul 2014 13:30:53 GMT',
      server: 'Apache/2.42', // different from baseHttpMessage
      connection: 'close' // different from baseHttpMessage
      // missing key "content-length"
    },
    body: '{"r2":"d2"}'
  };

  const similarHttpMessage = {
    statusCode: '200',
    headers: {
      'CONTENT-TYPE': 'application/json',
      DATE: 'Mon, 01 Jan 2011 01:01:01 GMT', // shall ignore DATE header differences
      SERVER: 'gunicorn/0.17.4',
      'CONTENT-LENGTH': '30',
      CONNECTION: 'keep-alive'
    },
    body: '{"origin":"1.2.3.4"}'
  };

  describe('validate', () => {
    describe('when I provide data', () => {
      ['response', 'request'].forEach((variant) => {
        describe(`for two cloned ${variant}s`, () => {
          const results = validate(baseHttpMessage, cloneHttpMessage);

          it('should results be an object', () => assert.isObject(results));
        });

        describe(`for similar ${variant}s`, () => {
          const results = validate(baseHttpMessage, similarHttpMessage);

          it('should results be an object', () => assert.isObject(results));
        });

        describe(`for different ${variant}s`, () => {
          const results = validate(baseHttpMessage, differentHttpMessage);

          it('should results be an object', () => assert.isObject(results));
          it('should results contain 2 different headers messages (missing content-length, different content-type)', () => {
            assert.isObject(results);
            assert.property(results.fields, 'headers');
            assert.isObject(results.fields.headers);
            assert.isArray(results.fields.headers.errors);
            assert.lengthOf(results.fields.headers.errors, 2);
          });
        });
      });
    });
  });
});
