const { Validatable } = require('../mixins/validatable-http-message')
const clone = require('clone')

class HttpRequest extends Validatable {
  constructor(resources = {}) {
    super()

    HttpRequest.resourceKeys.forEach((resourceKey) => {
      this[resourceKey] = clone(resources[resourceKey], false)
    })
  }
}

HttpRequest.resourceKeys = ['method', 'uri', 'headers', 'body', 'expected']

class ExpectedHttpRequest {
  constructor(resources = {}) {
    ExpectedHttpRequest.resourceKeys.forEach((resourceKey) => {
      this[resourceKey] = clone(resources[resourceKey], false)
    })
  }
}

ExpectedHttpRequest.resourceKeys = [
  'method',
  'uri',
  'headers',
  'body',
  'headersSchema',
  'bodySchema',
]

module.exports = {
  HttpRequest,
  ExpectedHttpRequest,
}
