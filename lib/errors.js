class MalformedDataError extends Error {}
class DataNotJsonParsableError extends MalformedDataError {}
class DataNotStringError extends MalformedDataError {}
class MalformedSchemaError extends Error {}
class SchemaNotJsonParsableError extends MalformedSchemaError {}
class UnknownValidatorError extends Error {}
class NotValidatableError extends Error {}
class NotEnoughDataError extends Error {}
class JsonSchemaNotValid extends Error {}

module.exports = {
  DataNotJsonParsableError,
  SchemaNotJsonParsableError,
  MalformedSchemaError,
  MalformedDataError,
  UnknownValidatorError,
  DataNotStringError,
  NotValidatableError,
  NotEnoughDataError,
  JsonSchemaNotValid,
}
