"use strict";

const DB = require('./src/DB');
Object.defineProperties(exports, {
    database: {
        enumerable: true,
        get() {
            return DB.database;
        },
    },
    orm: {
        enumerable: true,
        get() {
            return DB.orm;
        },
    },
});

exports.Boing = require('./src/Boing');
exports.BaseController = require('./src/BaseController');
exports.Routes = require('./src/Routes');
exports.View = require('./src/View');
