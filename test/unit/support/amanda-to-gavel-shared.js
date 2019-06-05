/* eslint-disable */
const validators = require('../../../lib/validators');
const fixtures = require('../../fixtures');
const jsonPointer = require('json-pointer');
const { assert } = require('chai');

exports.shouldBehaveLikeAmandaToGavel = (instance) => {
  describe('.evaluateOutputToResults()', () => {
    output = null;

    describe('if data is null', () => {
      before(() => {
        data = null;
        output = instance.evaluateOutputToResults(data);
      });
      it('should set no messages to results', () => {
        assert.equal(output.length, 0);
      });
    });

    describe("if data is Tully's sanitized pseudo amanda error with length 0", () => {
      before(() => {
        data = fixtures.emptyAmandaError;
      });
    });

    describe('if data is an amanda error', () => {
      before(() => {
        data = JSON.parse(fixtures.sampleAmandaError);
        output = instance.evaluateOutputToResults(data);
      });

      it('should return an array', () => {
        assert.isArray(output);
      });
    });

    describe('first element in results array', () => {
      item = null;
      before(() => {
        item = output[0];
      });

      it('should be an object', () => {
        assert.isObject(item);
      });

      const props = ['message', 'pointer'];
      props.forEach((key) => {
        it('should have "' + key + '"', () => {
          assert.include(Object.keys(item), key);
        });
      });

      describe('pointer key value', () => {
        value = null;
        before(() => {
          value = item['pointer'];
        });

        it('should be a string', () => {
          assert.isString(value);
        });

        it('should be a parseable JSON poitner', () => {
          parsed = jsonPointer.parse(value);

          assert.isArray(parsed);
        });
      });
    });
  });
};
