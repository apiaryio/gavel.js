const { Validatable } = require('../mixins/validatable-http-message')
const clone = require('clone')

class HttpResponse extends Validatable {
  constructor(resources = {}) {
    super()
    this.resourcesKeys = [
      'statusCode',
      'statusMessage',
      'headers',
      'body',
      'expected',
    ]

    this.resourcesKeys.forEach((resourceKey) => {
      this[resourceKey] = clone(resources[resourceKey], false)
    })
  }
}

class ExpectedHttpResponse {
  constructor(resources = {}) {
    this.resourcesKeys = [
      'statusCode',
      'statusMessage',
      'headers',
      'body',
      'headersSchema',
      'bodySchema',
    ]

    this.resourcesKeys.forEach((resourceKey) => {
      this[resourceKey] = clone(resources[resourceKey], false)
    })
  }
}

module.exports = {
  HttpResponse,
  ExpectedHttpResponse,
}
