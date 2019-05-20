/**
 * Applies a given evolution schema to the given data Object.
 * Properties not present in schema are bypassed.
 * Properties not present in data are ignored.
 * @param {Object} schema
 * @param {Object|Array} data
 * @returns {Object}
 */
const evolve = (schema) => (data) => {
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

  return Object.keys(data).reduce((acc, key) => {
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
  }, result);
};

module.exports = evolve;
