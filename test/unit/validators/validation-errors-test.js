const fixtures = require('../../fixtures');
const {
  ValidationErrors
} = require('../../../src/validators/validation-errors');

describe('ValidationErrors', () => {
  errors = {};
  amandaError = JSON.parse(fixtures.sampleAmandaError);

  describe('when I create ValidationErrors object from amanda error', () => {
    before(() => {
      errors = new ValidationErrors(amandaError);
    });

    it(
      'DEPRECATED: should has same int. keys and its values as original amanda error' // () => {
      // for (let i in [0..amandaError.length - 1]) {
      //   assert.deepEqual(amandaError[i], errors[i])
      // }
      //}
    );

    it(
      'DEPRECATED: should get correct error by getByPath' // () => {
      // for (let i in [0..amandaError.length - 1]) {
      //   assert.deepEqual(amandaError[i], errors.getByPath(amandaError[i]['property'])[0])
      // }
      //}
    );
  });
});
