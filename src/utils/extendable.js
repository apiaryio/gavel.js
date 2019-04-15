const extendable = {
  extend: (obj, self) => {
    for (let key in obj) {
      if (!['extended', 'included'].includes(key)) {
        self[key] = obj[key]
      }
    }

    if (obj.extended) {
      obj.extended.apply(self)
    }

    return this
  },

  include: (obj, self) => {
    for (let key in obj) {
      if (!['extended', 'included'].includes(key)) {
        self.prototype[key] = obj[key]
      }
    }

    if (obj.included) {
      obj.included.apply(self)
    }

    return this
  }
}

module.exports = {
  extendable
}
