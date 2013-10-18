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
    "$schema":"http://json-schema.org/draft-03/schema",
    "id":"#",
    "required":true,
    "additionalProperties":false,
    "type":"object",
    "properties":{
        "simple_key_value_pair":{
            "id":"simple_key_value_pair",
            "required":true,
            "enum":[
                "simple_key_value_pair_value"
            ],
            "type":"string"
        },
        "complex_key_value_pair":{
            "id":"complex_key_value_pair",
            "required":true,
            "additionalProperties":false,
            "type":"object",
            "properties":{
                "complex_key_value_pair_key1":{
                    "id":"complex_key_value_pair_key1",
                    "required":true,
                    "enum":[
                        "complex_key_value_pair_value1"
                    ],
                    "type":"string"
                },
                "complex_key_value_pair_key2":{
                    "id":"complex_key_value_pair_key2",
                    "required":true,
                    "enum":[
                        "complex_key_value_pair_value2"
                    ],
                    "type":"string"
                },
                "complex_key_value_pair_key3":{
                    "id":"complex_key_value_pair_key3",
                    "required":true,
                    "additionalProperties":false,
                    "type":"object",
                    "properties":{
                        "complex_key_value_pair_key1_in_nested_hash":{
                            "id":"complex_key_value_pair_key1_in_nested_hash",
                            "required":true,
                            "enum":[
                                "complex_key_value_pair_value1_in_nested_hash"
                            ],
                            "type":"string"
                        },
                        "complex_key_value_pair_key2_in_nested_hash":{
                            "id":"complex_key_value_pair_key2_in_nested_hash",
                            "required":true,
                            "enum":[
                                "complex_key_value_pair_value2_in_nested_hash"
                            ],
                            "type":"string"
                        }
                    }
                }
            }
        },
        "array_of_hashes":{
            "id":"array_of_hashes",
            "required":true,
            "additionalItems":false,
            "type":"array",
            "items":[
                {
                    "id":0,
                    "required":true,
                    "additionalProperties":false,
                    "type":"object",
                    "properties":{
                        "array_of_hashes_item1_key1":{
                            "id":"array_of_hashes_item1_key1",
                            "required":true,
                            "enum":[
                                "array_of_hashes_item1_value1"
                            ],
                            "type":"string"
                        },
                        "array_of_hashes_item1_key2":{
                            "id":"array_of_hashes_item1_key2",
                            "required":true,
                            "enum":[
                                "array_of_hashes_item1_value2"
                            ],
                            "type":"string"
                        }
                    }
                },
                {
                    "id":1,
                    "required":true,
                    "additionalProperties":false,
                    "type":"object",
                    "properties":{
                        "array_of_hashes_item2_key1":{
                            "id":"array_of_hashes_item2_key1",
                            "required":true,
                            "enum":[
                                "array_of_hashes_item2_value1"
                            ],
                            "type":"string"
                        },
                        "array_of_hashes_item2_key2":{
                            "id":"array_of_hashes_item2_key2",
                            "required":true,
                            "enum":[
                                "array_of_hashes_item2_value2"
                            ],
                            "type":"string"
                        }
                    }
                }
            ]
        },
        "array_of_mixed_simple_types":{
            "id":"array_of_mixed_simple_types",
            "required":true,
            "additionalItems":false,
            "type":"array",
            "items":[
                {
                    "id":0,
                    "required":true,
                    "enum":[
                        1
                    ],
                    "type":"integer"
                },
                {
                    "id":1,
                    "required":true,
                    "enum":[
                        2
                    ],
                    "type":"integer"
                },
                {
                    "id":2,
                    "required":true,
                    "enum":[
                        "a"
                    ],
                    "type":"string"
                },
                {
                    "id":3,
                    "required":true,
                    "enum":[
                        "b"
                    ],
                    "type":"string"
                }
            ]
        },
        "array_of_same_simple_types":{
            "id":"array_of_same_simple_types",
            "required":true,
            "additionalItems":false,
            "type":"array",
            "items":[
                {
                    "id":0,
                    "required":true,
                    "enum":[
                        "a"
                    ],
                    "type":"string"
                },
                {
                    "id":1,
                    "required":true,
                    "enum":[
                        "b"
                    ],
                    "type":"string"
                }
            ]
        }
    }

}
'''

sampleJsonSchemaNonStrict = '''
{
    "$schema":"http://json-schema.org/draft-03/schema",
    "id":"#",
    "required":true,
    "additionalProperties":true,
    "type":"object",
    "properties":{
        "simple_key_value_pair":{
            "id":"simple_key_value_pair",
            "required":true
        },
        "complex_key_value_pair":{
            "id":"complex_key_value_pair",
            "required":true,
            "additionalProperties":true,
            "type":"object",
            "properties":{
                "complex_key_value_pair_key1":{
                    "id":"complex_key_value_pair_key1",
                    "required":true
                },
                "complex_key_value_pair_key2":{
                    "id":"complex_key_value_pair_key2",
                    "required":true
                },
                "complex_key_value_pair_key3":{
                    "id":"complex_key_value_pair_key3",
                    "required":true,
                    "additionalProperties":true,
                    "type":"object",
                    "properties":{
                        "complex_key_value_pair_key1_in_nested_hash":{
                            "id":"complex_key_value_pair_key1_in_nested_hash",
                            "required":true
                        },
                        "complex_key_value_pair_key2_in_nested_hash":{
                            "id":"complex_key_value_pair_key2_in_nested_hash",
                            "required":true
                        }
                    }
                }
            }
        },
        "array_of_hashes":{
            "id":"array_of_hashes",
            "required":true,
            "additionalItems":true,
            "type":"array",
            "items":[
                {
                    "id":0,
                    "required":true,
                    "additionalProperties":true,
                    "type":"object",
                    "properties":{
                        "array_of_hashes_item1_key1":{
                            "id":"array_of_hashes_item1_key1",
                            "required":true
                        },
                        "array_of_hashes_item1_key2":{
                            "id":"array_of_hashes_item1_key2",
                            "required":true
                        }
                    }
                },
                {
                    "id":1,
                    "required":true,
                    "additionalProperties":true,
                    "type":"object",
                    "properties":{
                        "array_of_hashes_item2_key1":{
                            "id":"array_of_hashes_item2_key1",
                            "required":true
                        },
                        "array_of_hashes_item2_key2":{
                            "id":"array_of_hashes_item2_key2",
                            "required":true
                        }
                    }
                }
            ]
        },
        "array_of_mixed_simple_types":{
            "id":"array_of_mixed_simple_types",
            "required":true,
            "additionalItems":true,
            "type":"array",
            "items":[
                {
                    "id":0,
                    "required":true
                },
                {
                    "id":1,
                    "required":true
                },
                {
                    "id":2,
                    "required":true
                },
                {
                    "id":3,
                    "required":true
                }
            ]
        },
        "array_of_same_simple_types":{
            "id":"array_of_same_simple_types",
            "required":true,
            "additionalItems":true,
            "type":"array",
            "items":[
                {
                    "id":0,
                    "required":true
                },
                {
                    "id":1,
                    "required":true
                }
            ]
        }
    }
}
'''

sampleJsonSchemaNonStrict2 = '''
{
  "$schema":"http://json-schema.org/draft-03/schema",
  "id":"#",
  "required":true,
  "additionalProperties":true,
  "type":"object",
  "properties":{
    "simple_key_value_pairXXXXX":{
      "id":"simple_key_value_pair",
      "required":true
    },
    "complex_key_value_pair":{
      "id":"complex_key_value_pair",
      "required":true,
      "additionalProperties":true,
      "type":"object",
      "properties":{
        "complex_key_value_pair_key1":{
          "id":"complex_key_value_pair_key1",
          "required":true
        },
        "complex_key_value_pair_key2":{
          "id":"complex_key_value_pair_key2",
          "required":true
        },
        "complex_key_value_pair_key3":{
          "id":"complex_key_value_pair_key3",
          "required":true,
          "additionalProperties":true,
          "type":"object",
          "properties":{
            "complex_key_value_pair_key1_in_nested_hash":{
              "id":"complex_key_value_pair_key1_in_nested_hash",
              "required":true
            },
            "complex_key_value_pair_key2_in_nested_hash":{
              "id":"complex_key_value_pair_key2_in_nested_hash",
              "required":true
            }
          }
        }
      }
    },
    "array_of_hashes":{
      "id":"array_of_hashes",
      "required":true,
      "additionalItems":true,
      "type":"array",
      "items":[
      {
        "id":0,
        "required":true,
        "additionalProperties":true,
        "type":"object",
        "properties":{
          "array_of_hashes_item1_key1":{
            "id":"array_of_hashes_item1_key1",
            "required":true
          },
          "array_of_hashes_item1_key2":{
            "id":"array_of_hashes_item1_key2",
            "required":true
          }
        }
      },
      {
        "id":1,
        "required":true,
        "additionalProperties":true,
        "type":"object",
        "properties":{
          "array_of_hashes_item2_key1":{
            "id":"array_of_hashes_item2_key1",
            "required":true
          },
          "array_of_hashes_item2_key2":{
            "id":"array_of_hashes_item2_key2",
            "required":true
          }
        }
      }
      ]
    },
    "array_of_mixed_simple_types":{
      "id":"array_of_mixed_simple_types",
      "required":true,
      "additionalItems":true,
      "type":"array",
      "items":[
      {
        "id":0,
        "required":true
      },
      {
        "id":1,
        "required":true
      },
      {
        "id":2,
        "required":true
      },
      {
        "id":3,
        "required":true
      }
      ]
    },
    "array_of_same_simple_types":{
      "id":"array_of_same_simple_types",
      "required":true,
      "additionalItems":true,
      "type":"array",
      "items":[
      {
        "id":0,
        "required":true
      },
      {
        "id":1,
        "required":true
      }
      ]
    }
  }
}
'''

sampleJsonSchemaNonStrictCustom = '''
{
    "$schema":"http://json-schema.org/draft-03/schema",
    "id":"#",
    "required":true,
    "additionalProperties":true,
    "type":"object",
    "properties":{
        "simple_key_value_pair_custom":{
            "id":"simple_key_value_pair",
            "required":true
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
"Content-Type": "application/json",
"header2": "header2_value_changed"
}

sampleHeadersMiss = {
"Content-Type": "application/json",
}

sampleHeadersAdd = {
"Content-Type": "application/json",
"header2": "header2_value",
"header_added": "header_added_value",
}

sampleHeadersWithDateAndExpires = {
"Content-Type": "application/json",
"header2": "header2_value",
"Date": "Fri, 30 Oct 1998 13:19:41 GMT",
"Expires": "Fri, 30 Oct 1998 14:19:41 GMT",
}

sampleHeadersWithDateAndExpiresChanged = {
"Content-Type": "application/json",
"header2": "header2_value",
"Date": "Thu, 25 Jul 2013 23:59:59 GMT",
"Expires": "Thu, 25 Jul 2013 23:59:59 GMT",
}

sampleHeadersSchema = '''
{
  "$schema": "http://json-schema.org/draft-03/schema",
  "id": "#",
  "required": true,
  "additionalProperties": true,
  "type": "object",
  "properties": {
    "header1": {
      "id": "header1",
      "required": true,
      "enum": [
        "value1"
      ]
    }
  }
}
                      '''
sampleHttpRequestSchema = {
  "type":"object",
  "$schema": "http://json-schema.org/draft-03/schema",
  "id": "#",
  "required":true,
  "properties":{
    "body": {
      "type":"string",
      "id": "#/body",
      "required":true
    },
    "expected": {
      "type":"object",
      "id": "#/expected",
      "required":true,
      "properties":{
        "bodySchema": {
          "type":"object",
          "id": "#/expected/bodySchema",
          "required":true
        },
        "body": {
          "type":"string",
          "id": "#/expected/body",
          "required":true
        },
        "headersSchema": {
          "type":"object",
          "id": "#/expected/headersSchema",
          "required":true
        },
        "headers": {
          "type":"string",
          "id": "#/expected/headers",
          "required":true
        },
        "method": {
          "type":"string",
          "id": "#/expected/method",
          "required":true
        },
        "uri": {
          "type":"string",
          "id": "#/expected/uri",
          "required":true
        }
      }
    },
    "headers": {
      "type":"string",
      "id": "#/headers",
      "required":true
    },
    "method": {
      "type":"string",
      "id": "#/method",
      "required":true
    },
    "uri": {
      "type":"string",
      "id": "#/uri",
      "required":true
    }
  }
}

sampleHttpResponseSchema = {
  "type":"object",
  "$schema": "http://json-schema.org/draft-03/schema",
  "id": "#",
  "required":true,
  "properties":{
    "body": {
      "type":"string",
      "id": "#/body",
      "required":true
    },
    "expected": {
      "type":"object",
      "id": "#/expected",
      "required":true,
      "properties":{
        "bodySchema": {
          "type":"object",
          "id": "#/expected/bodySchema",
          "required":true,
          "properties":{
            "type": {
              "type":"string",
              "id": "#/expected/bodySchema/type",
              "required":true
            }
          }
        },
        "body": {
          "type":"string",
          "id": "#/expected/body",
          "required":true
        },
        "headersSchema": {
          "type":"object",
          "id": "#/expected/headersSchema",
          "required":true,
          "properties":{
            "type": {
              "type":"string",
              "id": "#/expected/headersSchema/type",
              "required":true
            }
          }
        },
        "headers": {
          "type":"string",
          "id": "#/expected/headers",
          "required":true
        },
        "statusCode": {
          "type":"string",
          "id": "#/expected/statusCode",
          "required":true
        },
        "statusMessage": {
          "type":"string",
          "id": "#/expected/statusMessage",
          "required":true
        }
      }
    },
    "headers": {
      "type":"string",
      "id": "#/headers",
      "required":true
    },
    "statusCode": {
      "type":"string",
      "id": "#/statusCode",
      "required":true
    },
    "statusMessage": {
      "type":"string",
      "id": "#/statusMessage",
      "required":true
    }
  }
}

sampleHttpMessageSchema =
{
  "type":"object",
  "$schema": "http://json-schema.org/draft-03/schema",
  "id": "http://jsonschema.net",
  "required":true,
  "properties":{
    "httpRequest": {
      "type":"object",
      "id": "httpRequest",
      "required":true,
      "properties":{
        "body": {
          "type":"string",
          "id": "httpRequest/body",
          "required":true
        },
        "expected": {
          "type":"object",
          "id": "httpRequest/expected",
          "required":true,
          "properties":{
            "bodySchema": {
              "type":"object",
              "id": "httpRequest/expected/bodySchema",
              "required":true,
              "properties":{
                "type": {
                  "type":"string",
                  "id": "httpRequest/expected/bodySchema/type",
                  "required":true
                }
              }
            },
            "body": {
              "type":"string",
              "id": "httpRequest/expected/body",
              "required":true
            },
            "headersSchema": {
              "type":"object",
              "id": "httpRequest/expected/headersSchema",
              "required":true,
              "properties":{
                "type": {
                  "type":"string",
                  "id": "httpRequest/expected/headersSchema/type",
                  "required":true
                }
              }
            },
            "headers": {
              "type":"string",
              "id": "httpRequest/expected/headers",
              "required":true
            },
            "method": {
              "type":"string",
              "id": "httpRequest/expected/method",
              "required":true
            },
            "uri": {
              "type":"string",
              "id": "httpRequest/expected/uri",
              "required":true
            }
          }
        },
        "headers": {
          "type":"string",
          "id": "httpRequest/headers",
          "required":true
        },
        "method": {
          "type":"string",
          "id": "httpRequest/method",
          "required":true
        },
        "uri": {
          "type":"string",
          "id": "httpRequest/uri",
          "required":true
        }
      }
    },
    "httpResponse": {
      "type":"object",
      "id": "httpResponse",
      "required":true,
      "properties":{
        "body": {
          "type":"string",
          "id": "httpResponse/body",
          "required":true
        },
        "expected": {
          "type":"object",
          "id": "httpResponse/expected",
          "required":true,
          "properties":{
            "bodySchema": {
              "type":"object",
              "id": "httpResponse/expected/bodySchema",
              "required":true,
              "properties":{
                "type": {
                  "type":"string",
                  "id": "httpResponse/expected/bodySchema/type",
                  "required":true
                }
              }
            },
            "body": {
              "type":"string",
              "id": "httpResponse/expected/body",
              "required":true
            },
            "headersSchema": {
              "type":"object",
              "id": "httpResponse/expected/headersSchema",
              "required":true,
              "properties":{
                "type": {
                  "type":"string",
                  "id": "httpResponse/expected/headersSchema/type",
                  "required":true
                }
              }
            },
            "headers": {
              "type":"string",
              "id": "httpResponse/expected/headers",
              "required":true
            },
            "statusCode": {
              "type":"string",
              "id": "httpResponse/expected/statusCode",
              "required":true
            },
            "statusMessage": {
              "type":"string",
              "id": "httpResponse/expected/statusMessage",
              "required":true
            }
          }
        },
        "headers": {
          "type":"string",
          "id": "httpResponse/headers",
          "required":true
        },
        "statusCode": {
          "type":"string",
          "id": "httpResponse/statusCode",
          "required":true
        },
        "statusMessage": {
          "type":"string",
          "id": "httpResponse/statusMessage",
          "required":true
        }
      }
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
  sampleAmandaError                : sampleAmandaError
  sampleAmandaError2               : sampleAmandaError2
  sampleFormatedError              : sampleFormatedError
  sampleError                      : sampleError
  sampleHttpRequestSchema          : sampleHttpRequestSchema
  sampleHttpResponseSchema         : sampleHttpResponseSchema
  sampleHeadersSchema              : sampleHeadersSchema
  sampleHttpMessageSchema          : sampleHttpMessageSchema
  sampleHeadersWithDateAndExpires  : sampleHeadersWithDateAndExpires
  sampleHeadersWithDateAndExpiresChanged : sampleHeadersWithDateAndExpiresChanged




