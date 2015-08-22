"use strict";
require('dotenv').load();
require('coffee-script/register');

let env = process.env.ENV || 'development';
let host = process.env.HOST || 'localhost';
let port = process.env.PORT || 3000;

require('@rdcl/boing').Boing
    .initialize(__dirname, env)
    .listen(port, host);
