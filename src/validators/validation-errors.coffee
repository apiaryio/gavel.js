# Wrapper class for errors provided by {Amanda} json schema validator
# @author Peter Grilli <tully@apiary.io>
class ValidationErrors
  # Construct a ValidationErrors
  constructor: (jsonErrors) ->
    @length = jsonErrors?.length || 0

    if @length > 0
      for i in [0..@length - 1]
        @[i] = jsonErrors[i]

module.exports = {
  ValidationErrors
}
