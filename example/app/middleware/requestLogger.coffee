"use strict"

ms = require 'ms'

requestLogger = (next) ->
  start = process.hrtime()

  yield from next

  end = process.hrtime(start)
  console.log 'request "%s %s" took %s',
    this.request.method,
    this.request.url,
    ms(end[0] * 1000 + end[1] / 1000000)


exports = module.exports = requestLogger
