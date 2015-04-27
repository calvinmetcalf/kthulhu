## Version 0.1.2

+ Allow callback style instead of using `return` style composition.

> `next()` will not be automatically invoked if the user transform returns `undefined`

## Version 0.1.1

+ Add `.map()` transform function to `chunk`.

## Version 0.1.0

+ Add `objectMode: true` by default. Meaning that stream.read(n) returns a single value instead of a Buffer of size n.
