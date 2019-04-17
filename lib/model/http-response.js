const { Validatable } = require('../mixins/validatable-http-message');
const clone = require('clone');

class HttpResponse extends Validatable {
  /**
   *
   * @option {number} statusCode
   * @option {string} statusMessage
   * @option {Object} headers
   * @option {string} body
   * @option {ExpectedHttpResponse} expected
   */
  constructor(resources = {}) {
    super();
    this.constructor.resourceKeys.forEach((resourceKey) => {
      this[resourceKey] = clone(resources[resourceKey], false);
    });
  }
}

HttpResponse.resourceKeys = [
  'statusCode',
  'statusMessage',
  'headers',
  'body',
  'expected'
];

class ExpectedHttpResponse {
  /**
   *
   * @option {number} statusCode
   * @option {string} statusMessage
   * @option {Object} headers
   * @option {string} body
   * @option {Object} headersSchema If not defined, generated from headers ({SchemaGenerator})
   * @option {Object} bodySchema If not defined, generated from body ({SchemaGenerator})
   */
  constructor(resources = {}) {
    this.constructor.resourceKeys.forEach((resourceKey) => {
      this[resourceKey] = clone(resources[resourceKey], false);
    });
  }
}

ExpectedHttpResponse.resourceKeys = [
  'statusCode',
  'statusMessage',
  'headers',
  'body',
  'headersSchema',
  'bodySchema'
];

module.exports = {
  HttpResponse,
  ExpectedHttpResponse
};
