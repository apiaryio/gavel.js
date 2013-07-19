#@private
extendable =
  extend: (obj, self) ->
    for key, value of obj when key not in ['extended', 'included']
      self[key] = value

    obj.extended?.apply(self)
    this

  include: (obj, self) ->
    for key, value of obj when key not in ['extended', 'included']
      self::[key] = value

    obj.included?.apply(self)
    this

module.exports = {
  extendable
}