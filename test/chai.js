/* eslint-disable no-underscore-dangle */
const chai = require('chai');
const deepEqual = require('deep-equal');

const stringify = (obj) => {
  return JSON.stringify(obj, null, 2);
};

chai.use(({ Assertion }, utils) => {
  const createErrorPropertyAssertion = (propName, methodName) => {
    Assertion.addMethod(methodName, function(expectedValue) {
      const stringifiedObj = stringify(this._obj);
      const { currentError: error, currentErrorIndex } = this.__flags;
      const target = error[propName];
      const isRegExp = expectedValue instanceof RegExp;
      const matchWord = isRegExp ? 'matches' : 'equals';

      new Assertion(error).to.be.instanceOf(Object);
      new Assertion(error).to.have.property(propName);

      this.assert(
        isRegExp
          ? expectedValue.test(target)
          : deepEqual(target, expectedValue),
        `
Expected the next HTTP message field:

${stringifiedObj}

to have an error at index ${currentErrorIndex} that includes property "${propName}" that ${matchWord}:

${JSON.stringify(expectedValue)}

but got:

${JSON.stringify(target)}
  `,
        `
Expected the next HTTP message field:

${stringifiedObj}

to have an error at index ${currentErrorIndex} that includes property "${propName}" that not ${matchWord}:

${JSON.stringify(target)}
  `,
        JSON.stringify(target),
        JSON.stringify(expectedValue),
        true
      );
    });
  };

  createErrorPropertyAssertion('message', 'withMessage');
  createErrorPropertyAssertion('pointer', 'withPointer');
  createErrorPropertyAssertion('values', 'withValues');

  //
  // TODO
  // Finish the error messages
  Assertion.addMethod('kind', function(expectedValue) {
    const { kind } = this._obj;
    const stringifiedObj = stringify(this._obj);

    this.assert(
      kind === expectedValue,
      `
Expected the following HTTP message field:

${stringifiedObj}

to have "kind" property equal to "${expectedValue}".
      `,
      'asdas',
      expectedValue,
      kind,
      true
    );
  });

  utils.addProperty(Assertion.prototype, 'valid', function() {
    const { valid } = this._obj;
    const stringifiedObj = stringify(this._obj);

    this.assert(
      valid === true,
      `
Expected the following HTTP message field:

${stringifiedObj}

to have "valid" equal #{exp}, but got #{act}'.
`,
      `
Expected the following HTTP message field:

${stringifiedObj}

to be invalid, but it is actually valid.`,
      { valid },
      { valid: true },
      true
    );
  });

  utils.addProperty(Assertion.prototype, 'errors', function() {
    const { errors } = this._obj;
    const stringifiedObj = stringify(this._obj);

    this.assert(
      errors.length > 0,
      `
Expected the following HTTP message field:

${stringifiedObj}

to have some errors, but got no errors.
`,
      `
Expected the following HTTP message field:

${stringifiedObj}

to have no errors, but got ${errors.length} error(s).
      `,
      { errors: [] },
      { errors },
      true
    );

    utils.flag(this, 'object', errors);
  });

  Assertion.addMethod('errorAtIndex', function(index) {
    const { errors } = this._obj;
    const errorsCount = errors.length;

    new Assertion(errors).to.be.instanceOf(Array);
    new Assertion(errorsCount).to.be.a('number');

    this.assert(
      errors[index],
      `Expected to have error at index ${index}`,
      `Expected NOT to have error at index ${index}`
    );

    utils.flag(this, 'currentError', errors[index]);
    utils.flag(this, 'currentErrorIndex', index);
  });
});

module.exports = chai;
