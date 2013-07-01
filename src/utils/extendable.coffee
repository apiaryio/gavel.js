class Extendable
  @extendableKeywords = ['extended', 'included']

  @extend: (obj) ->
    for key, value of obj when key not in @extendableKeywords
      @[key] = value

    obj.extended?.apply(@)
    this

  @include: (obj) ->
    for key, value of obj when key not in @extendableKeywords
      @::[key] = value

    obj.included?.apply(@)
    this

module.exports = {
  Extendable
}