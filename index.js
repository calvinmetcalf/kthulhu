// ^(;,;)^
var Transform = require("readable-stream/transform")
var Util = require("util")

function isFunction (f) {
  return "function" === typeof f
}

var Kthulhu = module.exports = function (options, transform, flush) {
  if (!(this instanceof Kthulhu)) {
    // simple class instantiation trick
    return new Kthulhu(options, transform, flush)
  }

  if (isFunction(options)) {
    // shift arguments so users can ignore `options`
    transform = options
    flush = transform
    options = {}
  }

  this.options = options
  this._flush = isFunction(flush) ? flush : null
  this._userTransform = isFunction(transform) ? transform :
    function (chunk) {
      return chunk
    }

  Transform.call(this, options)
}

Util.inherits(Kthulhu, Transform)

Kthulhu.prototype._transform = function (chunk, encoding, next) {
  var result = this._userTransform(chunk, encoding, next) || null

  var push = function (value) {
    this.push(value)
    next()
  }.bind(this)

  if (result instanceof Promise) {
    result.then(push, null)
  } else {
    push(result)
  }
}
