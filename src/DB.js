"use strict";

const bookshelf = require('bookshelf');
const knex = require('knex');

let _database = null;
let _orm = null;

Object.defineProperties(exports, {
    database: {
        enumerable: true,
        get() {
            return _database;
        },
    },
    orm: {
        enumerable: true,
        get() {
            return _orm;
        },
    },
});

function initialize(client, connection) {
    exports.initialize = function initialize() {
        console.warn('Database has already been initialized!');
    };

    _database = knex({
        client,
        connection,
    });

    _orm = bookshelf(_database);
}

exports.initialize = initialize;
