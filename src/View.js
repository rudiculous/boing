"use strict";

const View = {

    SimpleView(src) {
        return function* () {
            console.log('TODO: view %s', src);
        };
    },

};

exports = module.exports = View;
