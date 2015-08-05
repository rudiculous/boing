"use strict"

{orm: {Model}} = require 'boing'

Test = Model.extend
  tableName: 'test'


exports = module.exports = Test
