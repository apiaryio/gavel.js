const nativeJsObjects = {
  '[object Arguments]': 'arguments',
  '[object Array]': 'array',
  '[object Date]': 'date',
  '[object Function]': 'function',
  '[object Number]': 'number',
  '[object RegExp]': 'regexp',
  '[object String]': 'string',
  '[object Null]': 'null',
  '[object Undefined]': 'undefined',
  '[object Object]': 'object'
};

function stringifyType(any) {
  return Object.prototype.toString.call(any);
}

function getType(any) {
  const type = stringifyType(any);

  return Object.prototype.hasOwnProperty.call(nativeJsObjects, type)
    ? nativeJsObjects[type]
    : typeof any;
}

module.exports = getType;
