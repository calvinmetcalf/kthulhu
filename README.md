[![Build Status][TravisLogo]][Travis] ![](https://img.shields.io/cocoapods/l/AFNetworking.svg)


<a name="cthulhu"></a>

<p align="center">
<b><a href="#synopsis">Synopsis</a></b>
|
<b><a href="#install">Install</a></b>
|
<b><a href="#examples">Examples</a></b>
|
<b><a href="#about">About</a></b>
</p>

<p align="center">
<a href="https://github.com/bucaran/cthulhu/blob/master/cthulhu">
<img width=40% src="https://cloud.githubusercontent.com/assets/8317250/7150097/26393d02-e351-11e4-8eff-eff06ceb44e4.png">
</a>
</p>

<p align="center">
<em><strong><a href="https://www.google.co.jp/search?q=cthulhu&client=safari&rls=en&biw=1276&bih=715&source=lnms&tbm=isch&sa=X&ei=QbEtVcq9I4G2mAXgvYDwAQ&ved=0CAYQ_AUoAQ">cthulhu</a> simpler transform streams</strong></em>
</p>

<hr>


# Synopsis

cthulhu is a [through2](https://github.com/rvagg/through2)-like simpler **transform**/passthru Stream wrapper. Uses [`readable-stream`](https://github.com/iojs/readable-stream) help fight global warming.

To push contents to the buffer simply `return chunk` inside your `transform` callback.

You can also return a [`Promise`](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Promise) and whatever `value` is resolved will be pushed to the buffer.

# Install

```sh
npm install cthulhu
```

# Examples


> See the [streams](https://nodejs.org/api/stream.html#stream_stream) documentation to learn more about Streams.

## Simple Transformation

```js
var go = require("cthulhu")

process.stdin
  .pipe(go(function (chunk) {
    return chunk.toString().split("").reverse().join("")
  }))
  .pipe(process.stdout)
```

```sh
» echo "uhluhtc" | ./example.js
cthulhu⏎
```

## Using Promises

`return chunk` is used to notify the stream implementation we are _done_ processing the supplied chunk. If your transformation is asynchrounous, you can return a [Promise](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Promise) instead and cthulhu will apply its resolved value to the buffer (whenever that happens).

```js
var go = require("cthulhu");

process.stdin
  .pipe(go(function (chunk) {
    return chunk.toString().toUpperCase()
  }))
  .pipe(go(function (chunk) {
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

# About

[MIT](http://opensource.org/licenses/MIT)

[TravisLogo]: https://travis-ci.org/bucaran/cthulhu.svg?branch=master

[Travis]: https://travis-ci.org/bucaran/cthulhu
