const getType = require('./get-type');

const SCHEMA_VERSION = 'http://json-schema.org/draft-04/schema#';

class SchemaV4Properties {
  /**
   * @param {boolean} keyStrict
   * @param {string[] | boolean} valuesStrict
   * @param {boolean} typesStrict
   */
  constructor({ keysStrict, valuesStrict, typesStrict }) {
    this.set({ keysStrict, valuesStrict, typesStrict });
  }

  /**
   * @option {boolean} keyStrict
   * @option {string[] | boolean} valuesStrict
   * @option {boolean} typesStrict
   */
  set({ keysStrict, valuesStrict, typesStrict }) {
    this.keysStrict = keysStrict || false;
    this.valuesStrict = valuesStrict || false;
    this.typesStrict = typesStrict || false;
  }
}

class SchemaV4Generator {
  /**
   * @option {Object} json
   * @option {SchemaProperties} properties
   */
  constructor({ json, properties }) {
    this.json = typeof json === 'string' ? JSON.parse(json) : json;

    this.schema = undefined;
    this.properties = properties || new SchemaV4Properties({});

    if (Array.isArray(this.properties.valuesStrict)) {
      this.properties.valuesStrict = this.properties.valuesStrict.map((value) =>
        value.toLowerCase()
      );
    }
  }

  /**
   * @returns {Object} Generated JSON schema.
   */
  generate() {
    this.schema = this.getSchemaForObject({
      baseObject: this.json,
      objectId: undefined,
      firstLevel: true,
      properties: this.properties
    });

    return this.schema;
  }

  getSchemaTypeFor(value) {
    const valueType = getType(value);

    if (value === null) {
      return 'null';
    }
    if (valueType === 'array') {
      return 'array';
    }
    if (valueType === 'number' && value % 1 === 0) {
      return 'integer';
    }

    return valueType;
  }

  isBaseType(type) {
    return !['array', 'object'].includes(type);
  }

  getSchemaForObject({ baseObject, objectId, firstLevel, properties }) {
    let getSchemaForObjectProperties;
    if (firstLevel == null) {
      firstLevel = true;
    }

    if (!properties) {
      properties = new SchemaV4Properties();
    }
    const schemaDict = {};

    if (firstLevel) {
      schemaDict['$schema'] = SCHEMA_VERSION;
      schemaDict.id = '#';
    }

    if (objectId != null) {
      schemaDict.id = objectId;
    }

    const schemaType = this.getSchemaTypeFor(baseObject);

    const hasKeys =
      baseObject !== null &&
      typeof baseObject === 'object' &&
      Object.keys(baseObject).length > 0;

    if (schemaType === 'object') {
      if (properties.keysStrict) {
        schemaDict.additionalProperties = false;
      } else {
        schemaDict.additionalProperties = true;
      }
    } else if (schemaType === 'array') {
      if (properties.keysStrict) {
        schemaDict.additionalItems = false;
      } else {
        schemaDict.additionalItems = true;
      }
    }

    if (properties.valuesStrict === true && this.isBaseType(schemaType)) {
      schemaDict.enum = [baseObject];
    } else if (
      Array.isArray(properties.valuesStrict) &&
      this.isBaseType(schemaType)
    ) {
      if (
        properties.valuesStrict.indexOf(
          objectId != null ? objectId.toLowerCase() : undefined
        ) > -1
      ) {
        schemaDict.enum = [baseObject];
      }
    }

    if (
      (properties.typesStrict && this.isBaseType(schemaType)) ||
      !this.isBaseType(schemaType) ||
      firstLevel === true
    ) {
      schemaDict.type = schemaType;
    }

    if (schemaType === 'object' && hasKeys) {
      schemaDict.required = [];
      schemaDict.properties = {};
      for (let prop of Object.keys(baseObject || {})) {
        const value = baseObject[prop];
        getSchemaForObjectProperties = {
          baseObject: value,
          objectId: prop,
          firstLevel: false,
          properties
        };
        schemaDict.properties[prop] = this.getSchemaForObject(
          getSchemaForObjectProperties
        );
        schemaDict.required.push(prop);
      }
    } else if (schemaType === 'array' && baseObject.length > 0) {
      schemaDict.items = [];

      for (let itemIndex = 0; itemIndex < baseObject.length; itemIndex++) {
        const item = baseObject[itemIndex];
        getSchemaForObjectProperties = {
          baseObject: item,
          objectId: itemIndex.toString(),
          firstLevel: false,
          properties
        };
        schemaDict.items.push(
          this.getSchemaForObject(getSchemaForObjectProperties)
        );
      }
    }

    return schemaDict;
  }
}

module.exports = {
  SchemaV4Properties,
  SchemaV4Generator
};
