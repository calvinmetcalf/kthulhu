// ^(;,;)^
var Transform = require("readable-stream/transform")
var Util = require("util")

function isFunction (f) {
  return "function" === typeof f
}

var Kthulhu = module.exports = function (options, transform, flush) {
  if (!(this instanceof Kthulhu)) {
    return new Kthulhu(options, transform, flush)
  }

  if (isFunction(options)) {
    // shift arguments to allow skipping `options`
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

  var result = this._userTransform(chunk, encoding, next)

  if (undefined !== result) {
    Promise.resolve(result).then(push, next)
  }

  function push (value) {
    next(null, value)
  }
}
