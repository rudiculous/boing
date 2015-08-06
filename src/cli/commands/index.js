"use strict";

const path = require('path');

exports.get = function get(command) {
    return require(path.join(__dirname, command));
};
