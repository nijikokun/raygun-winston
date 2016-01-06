# raygun-winston [![NPM Version][version-image]][version-url] [![Build Status][build-image]][build-url] [![Dependency Status][david-image]][david-url]

[Raygun][raygun] transport for [winston][winston] using the [raygun4node][raygun-node] library

## Installation

Node `0.12+` requires `npm`.

``` sh
$ npm install raygun-winston --save
```

## Usage

```javascript
winston.add(require('raygun-winston'), options)
```

Instantiate before any other transports to ensure certain metadata properties are removed.

## Options

* **apiKey**: *String* - Raygun API key, can be found in your Application General Settings
* **tags**: *Array* - Global tags to be applied to all reports
* **user**: *Function* - Generate user object using passed `req` object
* **version**: *String* - For version tracking, calls `raygun.setVersion`

Additionally, any option supported by [raygun4node][raygun-node] library.

## Log Levels

This library only sends logs with the level `error` all other levels will be ignored.

## Metadata

The following winston log metadata properties are used in certain ways:

- **meta.req** - Server request object, used for `options.user` function
  - Removed after log function is invoked
- **meta.err** - Replaces generated `Error` object sent (better stack traces)
- **meta.tags** - Custom tags for this specific request.

[version-url]: https://www.npmjs.com/package/raygun-winston
[version-image]: https://img.shields.io/npm/v/raygun-winston.svg
[david-url]: https://david-dm.org/nijikokun/raygun-winston
[david-image]: https://david-dm.org/nijikokun/raygun-winston.svg
[raygun]: https://raygun.io
[raygun-node]: https://github.com/MindscapeHQ/raygun4node
[winston]: https://github.com/winstonjs/winston
[build-url]: http://travis-ci.org/nijikokun/raygun-winston
[build-image]: https://secure.travis-ci.org/nijikokun/raygun-winston.png
