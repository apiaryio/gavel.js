# Gavel.js change log

## 0.2.x
- Added decision diagram
- HTTP Component terminus
- Validatable components
- Added Validators API
- Added media types
- Removed HTTP Message class
- Pseudo media type for HTTP Headers JSON representation
- Validation result schema
- Plugable component validators
- HTTP body must be a string
- Test coverage improvement
- Removed 'schema' parameter from HeadersValidator
- Renamed HeadersValidator to HeadersJsonExample
- StatusCode validator
- Expected.jsonSchema must be a stringn not a object?
- JsonSchema validator accepts both string and object
- removed timestamp from validation errors
- Cucumber step definitions for Gavel spec v1.1

## 0.1.x
- Initial release for Gavel specification v1.0


**TODO:**
- ADD coverage reporter
- TBD HeadersValidator - rename pointer to field, better error text
- Forbidden untagged steps in Gavel spec - test to CI 
- remove sanitized zero length Amanda error
- Document media type validators JS api (validate(), evaluateOutputToResults)
- Add expected description to features
- Catch only syntax error when catchin' JSON parse
- Review codo rendering
- Remove ValidationErrors class
- TBD Status code validation message change
- Release to product changelog

## 0.3
- bug JsonExample real {}, expected {"a": "b"} no errors
- extract json schema generator for json examples and parameters
  - default schema generated from example
    - all keys required
    - all values must match type
  - parameters override generated defaults
- rewiew mocha before vs. beforeEach
- rewrite as functinoal
- refactor test suite to be more DRY
- remove bodySchema in expected, add expected type
- extract convertor for amanda to gavel errors
- move HeadersJsonExample.evaluateOutputToResults to AmandaToGavel
- body mime type decision diagram
- use upstream amanda (array vs dot notation)
- validate json schema against meta schemas
- do not distinguish if Request or Response in Async API
- remove actsAs paradigm
- case insensitive headers in media type identificator
- validators more unit testing approach
- move no validator found logic to setXXXresults() methods
- generic type identificators
- warning if added header


Release process:
- merge spec repo branch to master
- merge implementation repo branch to master
- tag spec and implementation
- npm publish