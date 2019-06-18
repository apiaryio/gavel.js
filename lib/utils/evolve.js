/**
 * Applies a given evolution schema to the given data Object.
 * Properties not present in schema are bypassed.
 * Properties not present in data are ignored.
 * @param {Object<string, any>} schema
 * @param {any[]|Object<string, any>} data
 * @returns {any[]|Object<string, any>}
 */
const evolve = (schema, { strict = false } = {}) => (data) => {
  const dataType = typeof data;
  const schemaType = typeof schema;
  const isArray = Array.isArray(data);
  const result = isArray ? [] : {};

  if (!(schema !== null && schemaType === 'object' && !Array.isArray(schema))) {
    throw new Error(
      `Failed to evolve: expected transformations schema to be an object, but got: ${schemaType}`
    );
  }

  if (dataType !== 'object') {
    throw new Error(
      `Failed to evolve: expected data to be an instance of array or object, but got: ${dataType}`
    );
  }

  const reducer = (acc, key) => {
    const value = data[key];
    const transform = schema[key];
    const transformType = typeof transform;

    /* eslint-disable no-nested-ternary */
    const nextValue =
      transformType === 'function'
        ? transform(value)
        : transform && transformType === 'object'
        ? evolve(transform)(value)
        : value;
    /* eslint-enable no-nested-ternary */

    return isArray ? acc.concat(nextValue) : { ...acc, [key]: nextValue };
  };

  const nextData = Object.keys(data).reduce(reducer, result);

  if (strict) {
    // Strict mode ensures all keys in expected schema are present
    // in the returned payload.
    return Object.keys(schema)
      .filter((expectedKey) => {
        return !Object.prototype.hasOwnProperty.call(data, expectedKey);
      })
      .reduce(reducer, nextData);
  }

  return nextData;
};

module.exports = evolve;
