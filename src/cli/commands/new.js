"use strict";

exports = module.exports = function (yargs) {
    const args = yargs
        .help('help')
        .alias('h', 'help')
        .argv;

    console.log(args);
};
