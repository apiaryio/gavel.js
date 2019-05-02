const { Validatable } = require('../mixins/validatable-http-message');
const clone = require('clone');

class HttpRequest extends Validatable {
  /**
   * @option {string} method
   * @option {string} uri
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

HttpRequest.resourceKeys = ['method', 'uri', 'headers', 'body', 'expected'];

class ExpectedHttpRequest {
  /**
   * @option {string} method
   * @option {string} uri
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

ExpectedHttpRequest.resourceKeys = [
  'method',
  'uri',
  'headers',
  'body',
  'headersSchema',
  'bodySchema'
];

module.exports = {
  HttpRequest,
  ExpectedHttpRequest
};
