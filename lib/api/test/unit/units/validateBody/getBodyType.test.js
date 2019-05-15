const { assert } = require('chai');
const mediaTyper = require('media-typer');
const { getBodyType } = require('../../../../units/validateBody');

const jsonTypes = ['application/json', 'application/schema+json'];
const nonJsonTypes = ['text/plain'];

describe('getBodyType', () => {
  describe('when given json-like content type', () => {
    jsonTypes.forEach((jsonType) => {
      describe(`when given "${jsonType}" content type`, () => {
        describe('and parsable json body', () => {
          const res = getBodyType('{ "foo": "bar" }', jsonType);

          it('returns no errors', () => {
            assert.isNull(res[0]);
          });

          it(`returns "${jsonType}" media type`, () => {
            assert.deepEqual(res[1], mediaTyper.parse(jsonType));
          });
        });

        describe('and non-parsable json body', () => {
          const res = getBodyType('abc', jsonType);

          it('returns parsing error', () => {
            assert.match(
              res[0],
              new RegExp(
                /* eslint-disable no-useless-escape */
                `^Real body 'Content-Type' header is \'${jsonType.replace(
                  /(\/|\+)/g,
                  '\\$1'
                )}\' but body is not a parseable JSON:`
                /* eslint-enable no-useless-escape */
              )
            );
          });

          it('uses "text/plain" as fallback media type', () => {
            assert.deepEqual(res[1], mediaTyper.parse('text/plain'));
          });
        });
      });
    });
  });

  describe('when given non-json content type', () => {
    nonJsonTypes.forEach((nonJsonType) => {
      describe(`when given "${nonJsonType}" content type`, () => {
        describe('and parsable json body', () => {
          const res = getBodyType('{ "foo": "bar" }', nonJsonType);

          it('returns no errors', () => {
            assert.isNull(res[0]);
          });

          it('coerces to "application/json" media type', () => {
            assert.deepEqual(res[1], mediaTyper.parse('application/json'));
          });
        });

        describe('and a non-json body', () => {
          const res = getBodyType('abc', nonJsonType);

          it('returns no errors', () => {
            assert.isNull(res[0]);
          });

          it(`returns "${nonJsonType}" media type`, () => {
            assert.deepEqual(res[1], mediaTyper.parse(nonJsonType));
          });
        });
      });
    });
  });
});
