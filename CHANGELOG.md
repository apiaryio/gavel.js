# Gavel.js change log proposal

## 0.2
- Added decision diagram
- HTTP Component terminus
- Validatable components
- Validators API
  - Using GoogleDiff for TEXT comparison in TextDiff
  - Using 
- Added validators for combination of media types
- Removed HTTP Message
- Pseudo media type for HTTP Headers JSON representation
- Validation result schema
- Plugable component validators
- HTTP body must be a string
- Test coverage improvement
- Removed 'schema' parameter from HeadersValidator
- Renamed HeadersValidator to HeadersJsonExample
- statusCode validator
- expected.jsonSchema must be a stringn not a object?
- schema validator accepts both string and object

**TODO:**
- TBD consider headers pointer vs. field and error copywriting
- no untagged steps
- remove timestamp from validation errors
- remove tully's sanitized zero error
- document media type validators api (validate(), evaluateOutputToResults)
- add expected description to features
- catch only syntax error when catchin' JSON parse
- review codo rendering
- Cucumber integration tests
- get rid of validation errors
- eradicate error classes
- gavel release management
- status code validation message can change

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

