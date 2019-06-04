const { assert } = require('chai');
const {
  normalizeMethod
} = require('../../../../units/normalize/normalizeMethod');

describe('normalizeMethod', () => {
  it('removes trailing spaces', () => {
    assert.equal(normalizeMethod(' POST  '), 'POST');
  });

  it('converts to uppercase', () => {
    assert.equal(normalizeMethod('pUt'), 'PUT');
  });
});
