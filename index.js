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
    flush = transform
    transform = options
    options = { objectMode: true }
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
  chunk.map = chunk.map || function (cb) {
    for (var i = 0; i < chunk.length; i++)
      chunk[i] = cb(chunk[i], i, chunk)
    return chunk
  }

  var result = this._userTransform(chunk, encoding, next) || null

  var push = function (value) {
    next(null, value)
  }.bind(this)

  if (result instanceof Promise) {
    result.then(push, null)
  } else {
    push(result)
  }
}
