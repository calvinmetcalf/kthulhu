// ^(;,;)^
var fs = require("fs")
var test = require("tap").test
var go = require("../index")

test("test", function (t) {
  var rs = fs.createReadStream(__dirname + "/test")
    .pipe(go(function (chunk) {
      return chunk.toString().split("").reverse().join("").toUpperCase()
    }))

  var str = ""
  rs.on("data", function (chunk) {
    str += chunk.toString()
  })

  rs.on("finish", function () {
    t.equal("\nTSET A SI SIHT", str)
    t.end()
  })
});

test("multiple calls to next", function (t) {
  var rs = fs.createReadStream(__dirname + "/test")
    .pipe(go(function (chunk, _, next) {
      setImmediate(next);
      return chunk.toString().split("").reverse().join("").toUpperCase()
    }))

  var str = ""
  rs.on("data", function (chunk) {
    str += chunk.toString()
  })

  rs.on("finish", function () {
    t.equal("\nTSET A SI SIHT", str)
    t.end()
  })
});
