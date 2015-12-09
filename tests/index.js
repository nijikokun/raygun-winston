var assert = require('assert')
var winston = require('winston')
var transport = require('../index')
var token = 'API_TOKEN'

// Should throw options.apiKey is required error
assert.throws(function () { new transport() }, Error)

// Describe raygun-winston
var Transport = new transport({
  apiKey: token
})

// Should have property name, and equal raygun
assert.equal(Transport.name, 'raygun')

// Should have property level, and equal error
assert.equal(Transport.level, 'error')

// Should have property client, and be of type object
assert.equal(typeof Transport.client, 'object')

// Should have property log, and be of type function
assert.equal(typeof Transport.log, 'function')

// Describe initialized logger
var logger = new winston.Logger({
  transports: [ new transport({ apiKey: token }) ],
  exitOnError: false
})

// Should have raygun transport on logger when initialized with raygun transport
assert.equal(logger.transports.hasOwnProperty('raygun'), true)

// Describe non-initialized logger
var logger = new winston.Logger({
  transports: [],
  exitOnError: false
})

// Should properly initialize transport via add method
logger.add(transport, { apiKey: token })

// Should have raygun transport on logger when initialized with add method
assert.equal(logger.transports.hasOwnProperty('raygun'), true)