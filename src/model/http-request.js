const { Validatable } = require('../mixins/validatable-http-message')
const clone = require('clone')

class HttpRequest extends Validatable {
  constructor(resources = {}) {
    super()
    this.resourceKeys = ['method', 'uri', 'headers', 'body', 'expected']

    this.resourceKeys.forEach((resourceKey) => {
      this[resourceKey] = clone(resources[resourceKey], false)
    })
  }
}

class ExpectedHttpRequest {
  constructor(resources = {}) {
    this.resourceKeys = [
      'method',
      'uri',
      'headers',
      'body',
      'headersSchema',
      'bodySchema',
    ]

    this.resourceKeys.forEach((resourceKey) => {
      this[resourceKey] = clone(resources[resourceKey], false)
    })
  }
}

module.exports = {
  HttpRequest,
  ExpectedHttpRequest,
}
