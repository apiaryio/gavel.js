# MalformedDataError class
#@private
class MalformedDataError extends Error

# DataNotJsonParsableError class
#@private
class DataNotJsonParsableError extends MalformedDataError

# DataNotStringError class
#@private
class DataNotStringError extends MalformedDataError

# MalformedSchemaError class
#@private
class MalformedSchemaError extends Error

# SchemaNotJsonParsableError class
#@private
class SchemaNotJsonParsableError extends MalformedSchemaError

# UnknownValidatorError class
#@private
class UnknownValidatorError extends Error

# NotValidatableError class
#@private
class NotValidatableError extends Error

# NotEnoughDataError class
#@private
class NotEnoughDataError extends Error

# JsonSchemaNotValid class
#@private
class JsonSchemaNotValid extends Error


module.exports = {
  DataNotJsonParsableError,
  SchemaNotJsonParsableError,
  MalformedSchemaError,
  MalformedDataError,
  UnknownValidatorError,
  DataNotStringError,
  NotValidatableError,
  NotEnoughDataError,
  JsonSchemaNotValid
}