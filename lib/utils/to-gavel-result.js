const jsonPointer = require('json-pointer');

function splitProperty(property) {
  return property.split(/\.|\[|\]/).filter(Boolean);
}

function reduceProperties(acc, property) {
  return acc.concat(splitProperty(property));
}

/**
 * Converts legacy (Amanda/TV4) error messages
 * to the Gavel-compliant structure.
 */
function toGavelResult(legacyErrors) {
  return Array.from({ length: legacyErrors.length }, (_, index) => {
    const item = legacyErrors[index];
    const propertyPath = item.property.reduce(reduceProperties, []);
    const pointer = jsonPointer.compile(propertyPath);

    return {
      message: item.message,
      location: {
        pointer,
        property: propertyPath
      }
    };
  });
}

module.exports = toGavelResult;
