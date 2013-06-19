class A
  constructor: ({a,b}) ->
    console.log b
  aa: (cb) ->

    return cb(10)


a = new A a:1
console.error a
x = a.aa (result) ->
  return result
console.error x