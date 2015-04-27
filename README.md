[![Build Status][TravisLogo]][Travis] ![](https://img.shields.io/badge/License-MIT-303030.svg?style=flat-square)


<a name="kthulhu"></a>

<p align="center">
<a href="https://github.com/bucaran/kthulhu/blob/master/kthulhu">
<img src="https://cloud.githubusercontent.com/assets/8317250/7349285/de6b198c-ed32-11e4-89bc-775b66ee3282.png">
</a>
</p>

<p align="center">
<b><a href="#synopsis">Synopsis</a></b>
|
<b><a href="#install">Install</a></b>
|
<b><a href="#examples">Examples</a></b>
|
<b><a href="#license">License</a></b>
</p>


```js
// Just passing through! ^(;,;)^
process.stdin.pipe($(function (chunk) { 
  return chunk
})).pipe(process.stdout)

// Swap all `a`'s for `z`'s
fs.createReadStream("aaa.txt")
  .pipe($(function (chunk) {
    return chunk.map(function (value) {
      return (value == 97) ? 122 : value 
    })
   }))
  .pipe(fs.createWriteStream("zzz.txt"))
  
// Using ES6 arrow functions (Use node --harmony)
fs.createReadStream("aaa.txt")
  .pipe($((chunk) => chunk.map((value) => value == 97 ? 122 : value))
  .pipe(fs.createWriteStream("zzz.txt"))
```

<hr>


# Synopsis

kthulhu is a [through2](https://github.com/rvagg/through2)-like simpler **transform**/passthru Stream wrapper. Uses [`readable-stream`](https://github.com/iojs/readable-stream) to help fight global warming and city crime.

To push contents to the buffer simply `return chunk` inside your `transform` callback.

You can also return a [`Promise`](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Promise) and whatever `value` is resolved will be pushed to the buffer.

# Install

```sh
npm install kthulhu
```

# Examples


> See the [streams](https://nodejs.org/api/stream.html#stream_stream) documentation to learn more about Streams.

## Simple Transformation

```js
var $ = require("kthulhu")

process.stdin // ^(;,;)^
  .pipe($(function (chunk) {
    return chunk.toString().split("").reverse().join("")
  }))
  .pipe(process.stdout)
```

```sh
» echo "uhluhtk" | ./example.js
kthulhu⏎
```

## Using Promises

`return chunk` is used to notify the stream implementation we are _done_ processing the supplied chunk. If your transformation is asynchrounous, you can return a [Promise](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Promise) instead and kthulhu will apply its resolved value to the buffer (whenever that happens).

```js
var $ = require("kthulhu") //^(;,;)^

process.stdin
  .pipe($(function (chunk) {
    return chunk.toString().toUpperCase()
  }))
  .pipe($(function (chunk) {
    // complicate it with a Promise
    return new Promise(function(resolve) {
      setTimeout(function () {
        resolve(chunk.toString() + ">>>>>")
      }, 1000)
    })
  }))
  .pipe(process.stdout)

```

```sh
» echo "hello!" | ./example.js
HELLO!
>>>>>⏎
```

## Simple CSS Selector with [Trumpet](https://github.com/substack/node-trumpet)

```js
function css(clss, transform) {
  var tr = require('trumpet')()
  var $ = require('kthulhu')

  clss = tr.select(clss).createStream()
  clss.pipe($(function (buf) {
    return transform(buf)
  })).pipe(clss)

  return tr
}

/*
./source.html

  <html>
  <head>
    <title></title>
  </head>
  <body>
    <div class="section">
      This is what you'll get!
    </div>
  </body>
  </html>
*/

var fs = require("fs")
var rs = fs.createReadStream(__dirname + "/source.html")
  .pipe(css(".section", function (html) {
    return /* ^(;,;)^ transform html */
  }))
  .pipe(process.stdout)
```


# License

[MIT](http://opensource.org/licenses/MIT)

[TravisLogo]: http://img.shields.io/travis/bucaran/kthulhu.svg?style=flat-square
[Travis]: https://travis-ci.org/bucaran/kthulhu
