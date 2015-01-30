emptyStringJson = '''
{
  "issue": ""
}
'''

sampleJson = '''
{
  "simple_key_value_pair": "simple_key_value_pair_value",
  "complex_key_value_pair": {
    "complex_key_value_pair_key1" : "complex_key_value_pair_value1",
    "complex_key_value_pair_key2" : "complex_key_value_pair_value2",
    "complex_key_value_pair_key3" : {
      "complex_key_value_pair_key1_in_nested_hash": "complex_key_value_pair_value1_in_nested_hash",
      "complex_key_value_pair_key2_in_nested_hash": "complex_key_value_pair_value2_in_nested_hash"
      }
    },

  "array_of_hashes": [
    {
      "array_of_hashes_item1_key1": "array_of_hashes_item1_value1",
      "array_of_hashes_item1_key2": "array_of_hashes_item1_value2"
    },
    {
      "array_of_hashes_item2_key1": "array_of_hashes_item2_value1",
      "array_of_hashes_item2_key2": "array_of_hashes_item2_value2"
    }

  ],
  "array_of_mixed_simple_types": [1,2,"a","b"],
  "array_of_same_simple_types": ["a","b"]
}
'''

sampleJsonSimpleKeyMissing = '''
{
  "complex_key_value_pair": {
    "complex_key_value_pair_key1" : "complex_key_value_pair_value1",
    "complex_key_value_pair_key2" : "complex_key_value_pair_value2",
    "complex_key_value_pair_key3" : {
      "complex_key_value_pair_key1_in_nested_hash": "complex_key_value_pair_value1_in_nested_hash",
      "complex_key_value_pair_key2_in_nested_hash": "complex_key_value_pair_value2_in_nested_hash"
      }
    },

  "array_of_hashes": [
    {
      "array_of_hashes_item1_key1": "array_of_hashes_item1_value1",
      "array_of_hashes_item1_key2": "array_of_hashes_item1_value2"
    },
    {
      "array_of_hashes_item2_key1": "array_of_hashes_item2_value1",
      "array_of_hashes_item2_key2": "array_of_hashes_item2_value2"
    }

  ],
  "array_of_mixed_simple_types": [1,2,"a","b"],
  "array_of_same_simple_types": ["a","b"]
}
'''

sampleJsonSimpleKeyAdded = '''
{
  "simple_key_value_pair": "simple_key_value_pair_value",
  "simple_key_value_pair_added": "simple_key_value_pair_value",
  "complex_key_value_pair": {
    "complex_key_value_pair_key1" : "complex_key_value_pair_value1",
    "complex_key_value_pair_key2" : "complex_key_value_pair_value2",
    "complex_key_value_pair_key3" : {
      "complex_key_value_pair_key1_in_nested_hash": "complex_key_value_pair_value1_in_nested_hash",
      "complex_key_value_pair_key2_in_nested_hash": "complex_key_value_pair_value2_in_nested_hash"
      }
    },

  "array_of_hashes": [
    {
      "array_of_hashes_item1_key1": "array_of_hashes_item1_value1",
      "array_of_hashes_item1_key2": "array_of_hashes_item1_value2"
    },
    {
      "array_of_hashes_item2_key1": "array_of_hashes_item2_value1",
      "array_of_hashes_item2_key2": "array_of_hashes_item2_value2"
    }

  ],
  "array_of_mixed_simple_types": [1,2,"a","b"],
  "array_of_same_simple_types": ["a","b"]
}
'''

sampleJsonSimpleKeyValueDiffers = '''
{
  "simple_key_value_pair": "simple_key_value_pair_value_diff",
  "complex_key_value_pair": {
    "complex_key_value_pair_key1" : "complex_key_value_pair_value1",
    "complex_key_value_pair_key2" : "complex_key_value_pair_value2",
    "complex_key_value_pair_key3" : {
      "complex_key_value_pair_key1_in_nested_hash": "complex_key_value_pair_value1_in_nested_hash",
      "complex_key_value_pair_key2_in_nested_hash": "complex_key_value_pair_value2_in_nested_hash"
      }
    },

  "array_of_hashes": [
    {
      "array_of_hashes_item1_key1": "array_of_hashes_item1_value1",
      "array_of_hashes_item1_key2": "array_of_hashes_item1_value2"
    },
    {
      "array_of_hashes_item2_key1": "array_of_hashes_item2_value1",
      "array_of_hashes_item2_key2": "array_of_hashes_item2_value2"
    }

  ],
  "array_of_mixed_simple_types": [1,2,"a","b"],
  "array_of_same_simple_types": ["a","b"]
}
'''

sampleJsonComplexKeyMissing = '''
{
  "simple_key_value_pair": "simple_key_value_pair_value",
  "complex_key_value_pair": {
    "complex_key_value_pair_key1" : "complex_key_value_pair_value1",
    "complex_key_value_pair_key2" : "complex_key_value_pair_value2",
    "complex_key_value_pair_key3" : {
      "complex_key_value_pair_key2_in_nested_hash": "complex_key_value_pair_value2_in_nested_hash"
      }
    },

  "array_of_hashes": [
    {
      "array_of_hashes_item1_key1": "array_of_hashes_item1_value1",
      "array_of_hashes_item1_key2": "array_of_hashes_item1_value2"
    },
    {
      "array_of_hashes_item2_key1": "array_of_hashes_item2_value1",
      "array_of_hashes_item2_key2": "array_of_hashes_item2_value2"
    }

  ],
  "array_of_mixed_simple_types": [1,2,"a","b"],
  "array_of_same_simple_types": ["a","b"]
}
'''

sampleJsonComplexKeyAdded = '''
{
  "simple_key_value_pair": "simple_key_value_pair_value",
  "complex_key_value_pair": {
    "complex_key_value_pair_key1" : "complex_key_value_pair_value1",
    "complex_key_value_pair_key2" : "complex_key_value_pair_value2",
    "complex_key_value_pair_key3" : {
      "complex_key_value_pair_key1_in_nested_hash": "complex_key_value_pair_value1_in_nested_hash",
      "complex_key_value_pair_key1_in_nested_hash_added": "complex_key_value_pair_value1_in_nested_hash",
      "complex_key_value_pair_key2_in_nested_hash": "complex_key_value_pair_value2_in_nested_hash"
      }
    },

  "array_of_hashes": [
    {
      "array_of_hashes_item1_key1": "array_of_hashes_item1_value1",
      "array_of_hashes_item1_key2": "array_of_hashes_item1_value2"
    },
    {
      "array_of_hashes_item2_key1": "array_of_hashes_item2_value1",
      "array_of_hashes_item2_key2": "array_of_hashes_item2_value2"
    }

  ],
  "array_of_mixed_simple_types": [1,2,"a","b"],
  "array_of_same_simple_types": ["a","b"]
}
'''

sampleJsonComplexKeyValueDiffers = '''
{
  "simple_key_value_pair": "simple_key_value_pair_value",
  "complex_key_value_pair": {
    "complex_key_value_pair_key1" : "complex_key_value_pair_value1",
    "complex_key_value_pair_key2" : "complex_key_value_pair_value2",
    "complex_key_value_pair_key3" : {
      "complex_key_value_pair_key1_in_nested_hash": "complex_key_value_pair_value1_in_nested_hash_diff",
      "complex_key_value_pair_key2_in_nested_hash": "complex_key_value_pair_value2_in_nested_hash"
      }
    },

  "array_of_hashes": [
    {
      "array_of_hashes_item1_key1": "array_of_hashes_item1_value1",
      "array_of_hashes_item1_key2": "array_of_hashes_item1_value2"
    },
    {
      "array_of_hashes_item2_key1": "array_of_hashes_item2_value1",
      "array_of_hashes_item2_key2": "array_of_hashes_item2_value2"
    }

  ],
  "array_of_mixed_simple_types": [1,2,"a","b"],
  "array_of_same_simple_types": ["a","b"]
}
'''

sampleJsonArrayItemAdded = '''
{
  "simple_key_value_pair": "simple_key_value_pair_value",
  "complex_key_value_pair": {
    "complex_key_value_pair_key1" : "complex_key_value_pair_value1",
    "complex_key_value_pair_key2" : "complex_key_value_pair_value2",
    "complex_key_value_pair_key3" : {
      "complex_key_value_pair_key1_in_nested_hash": "complex_key_value_pair_value1_in_nested_hash",
      "complex_key_value_pair_key2_in_nested_hash": "complex_key_value_pair_value2_in_nested_hash"
      }
    },

  "array_of_hashes": [
    {
      "array_of_hashes_item1_key1": "array_of_hashes_item1_value1",
      "array_of_hashes_item1_key2": "array_of_hashes_item1_value2"
    },
    {
      "array_of_hashes_item2_key1": "array_of_hashes_item2_value1",
      "array_of_hashes_item2_key2": "array_of_hashes_item2_value2"
    }

  ],
  "array_of_mixed_simple_types": [1,2,"a","b", "added"],
  "array_of_same_simple_types": ["a","b"]
}
'''

sampleJsonArrayItemMissing = '''
{
  "simple_key_value_pair": "simple_key_value_pair_value",
  "complex_key_value_pair": {
    "complex_key_value_pair_key1" : "complex_key_value_pair_value1",
    "complex_key_value_pair_key2" : "complex_key_value_pair_value2",
    "complex_key_value_pair_key3" : {
      "complex_key_value_pair_key1_in_nested_hash": "complex_key_value_pair_value1_in_nested_hash",
      "complex_key_value_pair_key2_in_nested_hash": "complex_key_value_pair_value2_in_nested_hash"
      }
    },

  "array_of_hashes": [
    {
      "array_of_hashes_item1_key1": "array_of_hashes_item1_value1",
      "array_of_hashes_item1_key2": "array_of_hashes_item1_value2"
    },
    {
      "array_of_hashes_item2_key1": "array_of_hashes_item2_value1",
      "array_of_hashes_item2_key2": "array_of_hashes_item2_value2"
    }

  ],
  "array_of_mixed_simple_types": [1,2,"a"],
  "array_of_same_simple_types": ["a","b"]
}
'''

sampleJsonSchema = '''
{
    "$schema": "http://json-schema.org/draft-04/schema#",
    "id": "#",
    "required": [
        "simple_key_value_pair",
        "complex_key_value_pair",
        "array_of_hashes",
        "array_of_mixed_simple_types",
        "array_of_same_simple_types"
    ],
    "additionalProperties": false,
    "type": "object",
    "properties": {
        "simple_key_value_pair": {
            "id": "simple_key_value_pair",
            "enum": [
                "simple_key_value_pair_value"
            ],
            "type": "string"
        },
        "complex_key_value_pair": {
            "id": "complex_key_value_pair",
            "additionalProperties": false,
            "type": "object",
            "properties": {
                "complex_key_value_pair_key1": {
                    "id": "complex_key_value_pair_key1",
                    "enum": [
                        "complex_key_value_pair_value1"
                    ],
                    "type": "string"
                },
                "complex_key_value_pair_key2": {
                    "id": "complex_key_value_pair_key2",
                    "enum": [
                        "complex_key_value_pair_value2"
                    ],
                    "type": "string"
                },
                "complex_key_value_pair_key3": {
                    "id": "complex_key_value_pair_key3",
                    "additionalProperties": false,
                    "type": "object",
                    "properties": {
                        "complex_key_value_pair_key1_in_nested_hash": {
                            "id": "complex_key_value_pair_key1_in_nested_hash",
                            "enum": [
                                "complex_key_value_pair_value1_in_nested_hash"
                            ],
                            "type": "string"
                        },
                        "complex_key_value_pair_key2_in_nested_hash": {
                            "id": "complex_key_value_pair_key2_in_nested_hash",
                            "enum": [
                                "complex_key_value_pair_value2_in_nested_hash"
                            ],
                            "type": "string"
                        }
                    },
                    "required": [
                        "complex_key_value_pair_key1_in_nested_hash",
                        "complex_key_value_pair_key2_in_nested_hash"
                    ]
                }
            },
            "required": [
                "complex_key_value_pair_key1",
                "complex_key_value_pair_key2",
                "complex_key_value_pair_key3"
            ]
        },
        "array_of_hashes": {
            "id": "array_of_hashes",
            "additionalItems": false,
            "type": "array",
            "items": [
                {
                    "id": "0",
                    "required": [
                        "array_of_hashes_item1_key1",
                        "array_of_hashes_item1_key2"
                    ],
                    "additionalProperties": false,
                    "type": "object",
                    "properties": {
                        "array_of_hashes_item1_key1": {
                            "id": "array_of_hashes_item1_key1",
                            "enum": [
                                "array_of_hashes_item1_value1"
                            ],
                            "type": "string"
                        },
                        "array_of_hashes_item1_key2": {
                            "id": "array_of_hashes_item1_key2",
                            "enum": [
                                "array_of_hashes_item1_value2"
                            ],
                            "type": "string"
                        }
                    }
                },
                {
                    "id": "1",
                    "required": [
                        "array_of_hashes_item2_key1",
                        "array_of_hashes_item2_key2"
                    ],
                    "additionalProperties": false,
                    "type": "object",
                    "properties": {
                        "array_of_hashes_item2_key1": {
                            "id": "array_of_hashes_item2_key1",
                            "enum": [
                                "array_of_hashes_item2_value1"
                            ],
                            "type": "string"
                        },
                        "array_of_hashes_item2_key2": {
                            "id": "array_of_hashes_item2_key2",
                            "enum": [
                                "array_of_hashes_item2_value2"
                            ],
                            "type": "string"
                        }
                    }
                }
            ]
        },
        "array_of_mixed_simple_types": {
            "id": "array_of_mixed_simple_types",
            "additionalItems": false,
            "type": "array",
            "items": [
                {
                    "id": "0",
                    "enum": [
                        1
                    ],
                    "type": "integer"
                },
                {
                    "id": "1",
                    "enum": [
                        2
                    ],
                    "type": "integer"
                },
                {
                    "id": "2",
                    "enum": [
                        "a"
                    ],
                    "type": "string"
                },
                {
                    "id": "3",
                    "enum": [
                        "b"
                    ],
                    "type": "string"
                }
            ]
        },
        "array_of_same_simple_types": {
            "id": "array_of_same_simple_types",
            "additionalItems": false,
            "type": "array",
            "items": [
                {
                    "id": "0",
                    "enum": [
                        "a"
                    ],
                    "type": "string"
                },
                {
                    "id": "1",
                    "enum": [
                        "b"
                    ],
                    "type": "string"
                }
            ]
        }
    }
}
'''


sampleJsonSchemaTestingAmandaMessages =
  "$schema":"http://json-schema.org/draft-03/schema"
  "id":"#"
  "required": true
  "additionalProperties": true
  "type": "object"
  "properties":
    check_minLength:
      required: true
      type: 'string'
      minLength: 20
    check_maxLength:
      required: true
      type: 'string'
      maxLength: 5
    check_length:
      required: true
      type: 'string'
      length: 2
    check_format:
      required: true
      type: 'string'
      format: 'decimal'
    check_except:
      required: true
      type: 'string'
      except: ['not_allowed', 'bad']
    check_minimum:
      required: true
      type: 'number'
      minimum: 5
    check_maximum:
      required: true
      type: 'number'
      maximum: 10
    check_pattern:
      required: true
      type: 'string'
      pattern: '/^[a]{2,4}$/g'
    check_maxItems:
      required: true
      type: 'array'
      maxItems: 2
    check_minItems:
      required: true
      type: 'array'
      minItems: 2
    check_divisibleBy:
      required: true
      type: 'number'
      divisibleBy: 2
    check_uniqueItems:
      required: true
      type: 'array'
      uniqueItems: true

sampleJsonBodyTestingAmandaMessages =
  check_minLength: 'very_short'
  check_maxLength: 'just_another_length'
  check_length: 'too_long'
  check_format: 'non_email'
  check_except: 'bad'
  check_minimum: 1
  check_maximum: 999
  check_pattern: 'bad pattern text'
  check_maxItems: ['too', 'many', 'things']
  check_minItems: ['solo_item']
  check_divisibleBy: 33
  check_uniqueItems: ['copy', 'unique', 'copy']

sampleJsonSchemaNonStrict = '''
{
    "$schema": "http://json-schema.org/draft-04/schema#",
    "id": "#",
    "required": [
        "simple_key_value_pair",
        "complex_key_value_pair",
        "array_of_hashes",
        "array_of_mixed_simple_types",
        "array_of_same_simple_types"
    ],
    "additionalProperties": true,
    "type": "object",
    "properties": {
        "simple_key_value_pair": {
            "id": "simple_key_value_pair"
        },
        "complex_key_value_pair": {
            "id": "complex_key_value_pair",
            "additionalProperties": true,
            "type": "object",
            "properties": {
                "complex_key_value_pair_key1": {
                    "id": "complex_key_value_pair_key1"
                },
                "complex_key_value_pair_key2": {
                    "id": "complex_key_value_pair_key2"
                },
                "complex_key_value_pair_key3": {
                    "id": "complex_key_value_pair_key3",
                    "additionalProperties": true,
                    "type": "object",
                    "properties": {
                        "complex_key_value_pair_key1_in_nested_hash": {
                            "id": "complex_key_value_pair_key1_in_nested_hash"
                        },
                        "complex_key_value_pair_key2_in_nested_hash": {
                            "id": "complex_key_value_pair_key2_in_nested_hash"
                        }
                    },
                    "required": [
                        "complex_key_value_pair_key1_in_nested_hash",
                        "complex_key_value_pair_key2_in_nested_hash"
                    ]
                }
            },
            "required": [
                "complex_key_value_pair_key1",
                "complex_key_value_pair_key2",
                "complex_key_value_pair_key3"
            ]
        },
        "array_of_hashes": {
            "id": "array_of_hashes",
            "additionalItems": true,
            "type": "array",
            "items": [
                {
                    "id": "0",
                    "required": [
                        "array_of_hashes_item1_key1",
                        "array_of_hashes_item1_key2"
                    ],
                    "additionalProperties": true,
                    "type": "object",
                    "properties": {
                        "array_of_hashes_item1_key1": {
                            "id": "array_of_hashes_item1_key1"
                        },
                        "array_of_hashes_item1_key2": {
                            "id": "array_of_hashes_item1_key2"
                        }
                    }
                },
                {
                    "id": "1",
                    "required": [
                        "array_of_hashes_item2_key1",
                        "array_of_hashes_item2_key2"
                    ],
                    "additionalProperties": true,
                    "type": "object",
                    "properties": {
                        "array_of_hashes_item2_key1": {
                            "id": "array_of_hashes_item2_key1"
                        },
                        "array_of_hashes_item2_key2": {
                            "id": "array_of_hashes_item2_key2"
                        }
                    }
                }
            ]
        },
        "array_of_mixed_simple_types": {
            "id": "array_of_mixed_simple_types",
            "additionalItems": true,
            "type": "array",
            "items": [
                {
                    "id": "0"
                },
                {
                    "id": "1"
                },
                {
                    "id": "2"
                },
                {
                    "id": "3"
                }
            ]
        },
        "array_of_same_simple_types": {
            "id": "array_of_same_simple_types",
            "additionalItems": true,
            "type": "array",
            "items": [
                {
                    "id": "0"
                },
                {
                    "id": "1"
                }
            ]
        }
    }
}
'''

sampleJsonSchemaNonStrict2 = '''
{
    "$schema": "http://json-schema.org/draft-04/schema#",
    "id": "#",
    "required": [
        "simple_key_value_pairXXXXX",
        "complex_key_value_pair",
        "array_of_hashes",
        "array_of_mixed_simple_types",
        "array_of_same_simple_types"
    ],
    "additionalProperties": true,
    "type": "object",
    "properties": {
        "simple_key_value_pairXXXXX": {
            "id": "simple_key_value_pair"
        },
        "complex_key_value_pair": {
            "id": "complex_key_value_pair",
            "additionalProperties": true,
            "type": "object",
            "properties": {
                "complex_key_value_pair_key1": {
                    "id": "complex_key_value_pair_key1"
                },
                "complex_key_value_pair_key2": {
                    "id": "complex_key_value_pair_key2"
                },
                "complex_key_value_pair_key3": {
                    "id": "complex_key_value_pair_key3",
                    "additionalProperties": true,
                    "type": "object",
                    "properties": {
                        "complex_key_value_pair_key1_in_nested_hash": {
                            "id": "complex_key_value_pair_key1_in_nested_hash"
                        },
                        "complex_key_value_pair_key2_in_nested_hash": {
                            "id": "complex_key_value_pair_key2_in_nested_hash"
                        }
                    },
                    "required": [
                        "complex_key_value_pair_key1_in_nested_hash",
                        "complex_key_value_pair_key2_in_nested_hash"
                    ]
                }
            },
            "required": [
                "complex_key_value_pair_key1",
                "complex_key_value_pair_key2",
                "complex_key_value_pair_key3"
            ]
        },
        "array_of_hashes": {
            "id": "array_of_hashes",
            "additionalItems": true,
            "type": "array",
            "items": [
                {
                    "id": 0,
                    "required": [
                        "array_of_hashes_item1_key1",
                        "array_of_hashes_item1_key2"
                    ],
                    "additionalProperties": true,
                    "type": "object",
                    "properties": {
                        "array_of_hashes_item1_key1": {
                            "id": "array_of_hashes_item1_key1"
                        },
                        "array_of_hashes_item1_key2": {
                            "id": "array_of_hashes_item1_key2"
                        }
                    }
                },
                {
                    "id": 1,
                    "required": [
                        "array_of_hashes_item2_key1",
                        "array_of_hashes_item2_key2"
                    ],
                    "additionalProperties": true,
                    "type": "object",
                    "properties": {
                        "array_of_hashes_item2_key1": {
                            "id": "array_of_hashes_item2_key1"
                        },
                        "array_of_hashes_item2_key2": {
                            "id": "array_of_hashes_item2_key2"
                        }
                    }
                }
            ]
        },
        "array_of_mixed_simple_types": {
            "id": "array_of_mixed_simple_types",
            "additionalItems": true,
            "type": "array",
            "items": [
                {
                    "id": 0,
                    "required": true
                },
                {
                    "id": 1,
                    "required": true
                },
                {
                    "id": 2,
                    "required": true
                },
                {
                    "id": 3,
                    "required": true
                }
            ]
        },
        "array_of_same_simple_types": {
            "id": "array_of_same_simple_types",
            "additionalItems": true,
            "type": "array",
            "items": [
                {
                    "id": 0,
                    "required": true
                },
                {
                    "id": 1,
                    "required": true
                }
            ]
        }
    }
}
'''

sampleJsonSchemaNonStrictCustom = '''
{
    "$schema": "http://json-schema.org/draft-04/schema",
    "id": "#",
    "required": [
        "simple_key_value_pair_custom"
    ],
    "additionalProperties": true,
    "type": "object",
    "properties": {
        "simple_key_value_pair_custom": {
            "id": "simple_key_value_pair"
        }
    }
}
'''

sampleText =  """
"Lorem ipsum dolor sit amet,
consectetur adipisicing elit, sed do eiusmod
tempor incididunt ut labore et dolore magna aliqua.
Ut enim ad minim veniam, quis nostrud
exercitation ullamco laboris nisi ut aliquip
ex ea commodo consequat. Duis aute irure dolor
in reprehenderit in voluptate velit esse cillum
"""

sampleTextLineDiffers =  """
"Lorem ipsum dolor sit amet,
consectetur adipisicing elit, sed do eiusmod
tempor incididunt ut labore et dolore magna aliqua. DIFF DIFF
Ut enim ad minim veniam, quis nostrud
exercitation ullamco laboris nisi ut aliquip
ex ea commodo consequat. Duis aute irure dolor
in reprehenderit in voluptate velit esse cillum
"""

sampleTextLineAdded =  """
"Lorem ipsum dolor sit amet,
consectetur adipisicing elit, sed do eiusmod
tempor incididunt ut labore et dolore magna aliqua.
tempor incididunt ut labore et dolore magna aliqua.
Ut enim ad minim veniam, quis nostrud
exercitation ullamco laboris nisi ut aliquip
ex ea commodo consequat. Duis aute irure dolor
in reprehenderit in voluptate velit esse cillum
"""

sampleTextLineMissing =  """
"Lorem ipsum dolor sit amet,
tempor incididunt ut labore et dolore magna aliqua.
Ut enim ad minim veniam, quis nostrud
exercitation ullamco laboris nisi ut aliquip
ex ea commodo consequat. Duis aute irure dolor
in reprehenderit in voluptate velit esse cillum
"""

sampleAmandaError = """
{
"0":{
  "property":[
    "complex_key_value_pair",
    "complex_key_value_pair_key3",
    "complex_key_value_pair_key1_in_nested_hash"
  ],
  "attributeName":"required",
  "attributeValue":true,
  "message":"The ‘complex_key_value_pair,complex_key_value_pair_key3,complex_key_value_pair_key1_in_nested_hash’ property is required.",
  "validator":"required",
  "validatorName":"required",
  "validatorValue":true
  },
  "1":{
  "property":[
    "complex_key_value_pair2",
    "complex_key_value_pair_key3",
    "complex_key_value_pair_key1_in_nested_hash"
  ],
  "attributeName":"required",
  "attributeValue":true,
  "message":"The ‘complex_key_value_pair2,complex_key_value_pair_key3,complex_key_value_pair_key1_in_nested_hash’ property is required.",
  "validator":"required",
  "validatorName":"required",
  "validatorValue":true
  },
  "length":2,
"errorMessages":{
}

}
"""

sampleAmandaError2 = """
{
  "0": {
    "property": [
      "complex_key_value_pair",
      "complex_key_value_pair_key3",
      "complex_key_value_pair_key1_in_nested_hash"
    ],
    "attributeName": "required",
    "attributeValue": true,
    "message": "The ‘complex_key_value_pair,complex_key_value_pair_key3,complex_key_value_pair_key1_in_nested_hash’ property is required.",
    "validator": "required",
    "validatorName": "required",
    "validatorValue": true
  },
  "length": 1,
  "errorMessages": {

  }
}
                     """

sampleFormatedError = '''
{
  "complex_key_value_pair,complex_key_value_pair_key3,complex_key_value_pair_key1_in_nested_hash": [
    {
    "property": [
      "complex_key_value_pair",
      "complex_key_value_pair_key3",
      "complex_key_value_pair_key1_in_nested_hash"
    ],
    "attributeName": "required",
    "attributeValue": true,
    "message": "The ‘complex_key_value_pair,complex_key_value_pair_key3,complex_key_value_pair_key1_in_nested_hash’ property is required.",
    "validator": "required",
    "validatorName": "required",
    "validatorValue": true
    }
  ]
}
                      '''

sampleError = """
{
  "0": {
    "property": [
      "complex_key_value_pair",
      "complex_key_value_pair_key3",
      "complex_key_value_pair_key1_in_nested_hash"
    ],
    "attributeName": "required",
    "attributeValue": true,
    "message": "The ‘complex_key_value_pair,complex_key_value_pair_key3,complex_key_value_pair_key1_in_nested_hash’ property is required.",
    "validator": "required",
    "validatorName": "required",
    "validatorValue": true
  },
  "length": 1,
  "amandaErrors": {
    "0": {
      "property": [
        "complex_key_value_pair",
        "complex_key_value_pair_key3",
        "complex_key_value_pair_key1_in_nested_hash"
      ],
      "attributeName": "required",
      "attributeValue": true,
      "message": "The ‘complex_key_value_pair,complex_key_value_pair_key3,complex_key_value_pair_key1_in_nested_hash’ property is required.",
      "validator": "required",
      "validatorName": "required",
      "validatorValue": true
    },
    "length": 1,
    "errorMessages": {

    }
  },
  "now": "1372330856889"
}
"""

sampleHeaders = {
  "Content-Type": "application/json",
  "header2": "header2_value"
}

sampleHeadersDiff = {
  "Content-Type": "application/fancy-madiatype",
  "header2": "header2_value"
}

sampleHeadersMiss = {
  "CONTENT-type": "application/json",
}

sampleHeadersAdd = {
  "Content-Type": "application/json",
  "HEADER2": "header2_value",
  "header_added": "header_added_value",
}

sampleHeadersMixedCase = {
  "CONTENT-TYPE": "application/json",
  "HEADER2": "header2_value"
}

sampleHeadersMixedCaseDiff = {
  "CONTENT-type": "application/json",
  "HEADer2": "header2_value_changed"
}

sampleHeadersNonContentNegotiation = {
  "Content-Type": "application/json",
  "header2": "header2_value",
  "Date": "Fri, 30 Oct 1998 13:19:41 GMT",
  "Expires": "Fri, 30 Oct 1998 14:19:41 GMT",
  "ETag": "123456789",
  "Location": "/here"
}

sampleHeadersWithNonContentNegotiationChanged = {
  "Content-Type": "application/json",
  "header2": "header2_value",
  "Date": "Thu, 25 Jul 2013 23:59:59 GMT",
  "Expires": "Thu, 25 Jul 2013 23:59:59 GMT",
  "ETag": "asdfghjk",
  "Location": "/there"
}

sampleHeadersSchema = '''
{
    "$schema": "http://json-schema.org/draft-04/schema",
    "id": "#",
    "required": [
        "header1"
    ],
    "additionalProperties": true,
    "type": "object",
    "properties": {
        "header1": {
            "id": "header1",
            "enum": [
                "value1"
            ]
        }
    }
}
                      '''
sampleHttpRequestSchema = {
  "type": "object",
  "$schema": "http://json-schema.org/draft-04/schema",
  "id": "#",
  "required": [
    "body",
    "expected",
    "headers",
    "method",
    "uri"
  ],
  "properties": {
    "body": {
      "type": "string",
      "id": "#/body"
    },
    "expected": {
      "type": "object",
      "id": "#/expected",
      "properties": {
        "bodySchema": {
          "type": "object",
          "id": "#/expected/bodySchema"
        },
        "body": {
          "type": "string",
          "id": "#/expected/body"
        },
        "headersSchema": {
          "type": "object",
          "id": "#/expected/headersSchema"
        },
        "headers": {
          "type": "string",
          "id": "#/expected/headers"
        },
        "method": {
          "type": "string",
          "id": "#/expected/method"
        },
        "uri": {
          "type": "string",
          "id": "#/expected/uri"
        }
      },
      "required": [
        "bodySchema",
        "body",
        "headersSchema",
        "headers",
        "method",
        "uri"
      ]
    },
    "headers": {
      "type": "string",
      "id": "#/headers"
    },
    "method": {
      "type": "string",
      "id": "#/method"
    },
    "uri": {
      "type": "string",
      "id": "#/uri"
    }
  }
}

sampleHttpResponseSchema = {
  "type": "object",
  "$schema": "http://json-schema.org/draft-04/schema",
  "id": "#",
  "required": [
    "body",
    "expected",
    "headers",
    "statusCode",
    "statusMessage"
  ],
  "properties": {
    "body": {
      "type": "string",
      "id": "#/body"
    },
    "expected": {
      "type": "object",
      "id": "#/expected",
      "properties": {
        "bodySchema": {
          "type": "object",
          "id": "#/expected/bodySchema",
          "properties": {
            "type": {
              "type": "string",
              "id": "#/expected/bodySchema/type"
            }
          },
          "required": [
            "type"
          ]
        },
        "body": {
          "type": "string",
          "id": "#/expected/body"
        },
        "headersSchema": {
          "type": "object",
          "id": "#/expected/headersSchema",
          "properties": {
            "type": {
              "type": "string",
              "id": "#/expected/headersSchema/type"
            }
          },
          "required": [
            "type"
          ]
        },
        "headers": {
          "type": "string",
          "id": "#/expected/headers"
        },
        "statusCode": {
          "type": "string",
          "id": "#/expected/statusCode"
        },
        "statusMessage": {
          "type": "string",
          "id": "#/expected/statusMessage"
        }
      },
      "required": [
        "bodySchema",
        "body",
        "headersSchema",
        "headers",
        "statusCode",
        "statusMessage"
      ]
    },
    "headers": {
      "type": "string",
      "id": "#/headers"
    },
    "statusCode": {
      "type": "string",
      "id": "#/statusCode"
    },
    "statusMessage": {
      "type": "string",
      "id": "#/statusMessage"
    }
  }
}

sampleHttpMessageSchema =
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-04/schema",
  "id": "http://jsonschema.net",
  "required": [
    "httpRequest",
    "httpResponse"
  ],
  "properties": {
    "httpRequest": {
      "type": "object",
      "id": "httpRequest",
      "properties": {
        "body": {
          "type": "string",
          "id": "httpRequest/body"
        },
        "expected": {
          "type": "object",
          "id": "httpRequest/expected",
          "properties": {
            "bodySchema": {
              "type": "object",
              "id": "httpRequest/expected/bodySchema",
              "properties": {
                "type": {
                  "type": "string",
                  "id": "httpRequest/expected/bodySchema/type"
                }
              },
              "required": [
                "type"
              ]
            },
            "body": {
              "type": "string",
              "id": "httpRequest/expected/body"
            },
            "headersSchema": {
              "type": "object",
              "id": "httpRequest/expected/headersSchema",
              "properties": {
                "type": {
                  "type": "string",
                  "id": "httpRequest/expected/headersSchema/type"
                }
              },
              "required": [
                "type"
              ]
            },
            "headers": {
              "type": "string",
              "id": "httpRequest/expected/headers"
            },
            "method": {
              "type": "string",
              "id": "httpRequest/expected/method"
            },
            "uri": {
              "type": "string",
              "id": "httpRequest/expected/uri"
            }
          },
          "required": [
            "bodySchema",
            "body",
            "headersSchema",
            "headers",
            "method",
            "uri"
          ]
        },
        "headers": {
          "type": "string",
          "id": "httpRequest/headers"
        },
        "method": {
          "type": "string",
          "id": "httpRequest/method"
        },
        "uri": {
          "type": "string",
          "id": "httpRequest/uri"
        }
      },
      "required": [
        "body",
        "expected",
        "headers",
        "method",
        "uri"
      ]
    },
    "httpResponse": {
      "type": "object",
      "id": "httpResponse",
      "properties": {
        "body": {
          "type": "string",
          "id": "httpResponse/body"
        },
        "expected": {
          "type": "object",
          "id": "httpResponse/expected",
          "properties": {
            "bodySchema": {
              "type": "object",
              "id": "httpResponse/expected/bodySchema",
              "properties": {
                "type": {
                  "type": "string",
                  "id": "httpResponse/expected/bodySchema/type"
                }
              },
              "required": [
                "type"
              ]
            },
            "body": {
              "type": "string",
              "id": "httpResponse/expected/body"
            },
            "headersSchema": {
              "type": "object",
              "id": "httpResponse/expected/headersSchema",
              "properties": {
                "type": {
                  "type": "string",
                  "id": "httpResponse/expected/headersSchema/type"
                }
              },
              "required": [
                "type"
              ]
            },
            "headers": {
              "type": "string",
              "id": "httpResponse/expected/headers"
            },
            "statusCode": {
              "type": "string",
              "id": "httpResponse/expected/statusCode"
            },
            "statusMessage": {
              "type": "string",
              "id": "httpResponse/expected/statusMessage"
            }
          },
          "required": [
            "bodySchema",
            "body",
            "headersSchema",
            "headers",
            "statusCode",
            "statusMessage"
          ]
        },
        "headers": {
          "type": "string",
          "id": "httpResponse/headers"
        },
        "statusCode": {
          "type": "string",
          "id": "httpResponse/statusCode"
        },
        "statusMessage": {
          "type": "string",
          "id": "httpResponse/statusMessage"
        }
      },
      "required": [
        "body",
        "expected",
        "headers",
        "statusCode",
        "statusMessage"
      ]
    }
  }
}

module.exports =
  emptyStringJson: emptyStringJson
  sampleJson                       : sampleJson
  sampleJsonSchema                 : sampleJsonSchema
  sampleJsonSchemaNonStrict        : sampleJsonSchemaNonStrict
  sampleJsonSchemaNonStrict2        : sampleJsonSchemaNonStrict2
  sampleJsonSchemaNonStrictCustom  : sampleJsonSchemaNonStrictCustom
  sampleJsonSimpleKeyMissing       : sampleJsonSimpleKeyMissing
  sampleJsonSimpleKeyAdded         : sampleJsonSimpleKeyAdded
  sampleJsonSimpleKeyValueDiffers  : sampleJsonSimpleKeyValueDiffers
  sampleJsonComplexKeyMissing      : sampleJsonComplexKeyMissing
  sampleJsonComplexKeyAdded        : sampleJsonComplexKeyAdded
  sampleJsonComplexKeyValueDiffers : sampleJsonComplexKeyValueDiffers
  sampleJsonArrayItemAdded         : sampleJsonArrayItemAdded
  sampleJsonArrayItemMissing       : sampleJsonArrayItemMissing
  sampleText                       : sampleText
  sampleTextLineAdded              : sampleTextLineAdded
  sampleTextLineMissing            : sampleTextLineMissing
  sampleTextLineDiffers            : sampleTextLineDiffers
  sampleHeaders                    : sampleHeaders
  sampleHeadersDiffers             : sampleHeadersDiff
  sampleHeadersMissing             : sampleHeadersMiss
  sampleHeadersAdded               : sampleHeadersAdd
  sampleHeadersMixedCase           : sampleHeadersMixedCase
  sampleHeadersMixedCaseDiffers    : sampleHeadersMixedCaseDiff
  sampleAmandaError                : sampleAmandaError
  sampleAmandaError2               : sampleAmandaError2
  sampleFormatedError              : sampleFormatedError
  sampleError                      : sampleError
  sampleHttpRequestSchema          : sampleHttpRequestSchema
  sampleHttpResponseSchema         : sampleHttpResponseSchema
  sampleHeadersSchema              : sampleHeadersSchema
  sampleHttpMessageSchema          : sampleHttpMessageSchema
  sampleHeadersWithNonContentNegotiationChanged  : sampleHeadersWithNonContentNegotiationChanged
  sampleHeadersNonContentNegotiation : sampleHeadersNonContentNegotiation
  sampleJsonSchemaTestingAmandaMessages: sampleJsonSchemaTestingAmandaMessages
  sampleJsonBodyTestingAmandaMessages: sampleJsonBodyTestingAmandaMessages



