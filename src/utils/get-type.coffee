nativeJsObjects =
  '[object Arguments]': 'arguments'
  '[object Array]': 'array'
  '[object Date]': 'date'
  '[object Function]': 'function'
  '[object Number]': 'number'
  '[object RegExp]': 'regexp'
  '[object String]': 'string'

objectToString = Object.prototype.toString

module.exports = (unknown) ->
  str = objectToString.call unknown
  if nativeJsObjects[str]
    return nativeJsObjects[str]
  if `unknown === null`
    return 'null'
  if `unknown === undefined`
    return 'undefined'
  if `unknown === Object(unknown)`
    return 'object'
  return typeof unknown
