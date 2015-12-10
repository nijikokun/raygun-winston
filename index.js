'use strict'

var winston = require('winston')
var raygun = require('raygun')
var util = require('util')

var Raygun = module.exports = function (options) {
  options = options || {}

  winston.Transport.call(this, options)

  if (!options || !options.apiKey) {
    throw new Error('RaygunTransport [options.apiKey] is required')
  }

  this.name = 'raygun'
  this.level = 'error'
  this.client = new raygun.Client()
  this.client.init(options)

  // User option
  if (typeof options.user === 'function') {
    this.client.user = options.user
  }

  // Deprecated, only for backwards compatibility support
  if (typeof options.user === 'object') {
    this.client.setUser(options.user)
  }

  // Enable version tracking
  if (typeof options.version !== 'undefined') {
    this.client.setVersion(options.version)
  }
}

// Error Message Dictionary
Raygun.errorMessages = {
  '5XX': 'Internal server error',
  '403': 'Over subscription plan limits',
  '401': 'Invalid API key'
}

// Inherit from `winston.Transport`
util.inherits(Raygun, winston.Transport)

// Backwards compatibility
winston.transports.Raygun = Raygun

// Transport name
Raygun.prototype.name = 'raygun'

// Winston Transport Function
Raygun.prototype.log = function (level, msg, meta, callback) {
  var instance = this
  var error
  var tags
  var err
  var req
  var res

  if (level !== 'error' || this.silent) {
    return callback(null, true)
  }

  if (meta.req) {
    req = meta.req
    meta.req = undefined
  }

  if (meta.res) {
    res = meta.res
    meta.res = undefined
  }

  error = winston.clone(meta || {})
  error.level = level
  error.message = msg

  if (error.err) {
    err = error.err
    error.err = undefined
  }

  if (error.tags) {
    tags = error.tags
    error.tags = undefined
  }

  this.client.send(err || new Error(error.message), error, function (raygunResponse) {
    var code = raygunResponse.statusCode > 499 ? '5XX' : raygunResponse.statusCode

    if (Raygun.errorMessages[code]) {
      return callback(new Error('RaygunTransport [' + code + '] ' + Raygun.errorMessages[code]))
    }

    instance.emit('logged')
    return callback(null, true)
  }, req, tags)
}