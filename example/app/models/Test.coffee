"use strict"

{orm: {Model}} = require '@rdcl/boing'

Test = Model.extend
  tableName: 'test'


exports = module.exports = Test
