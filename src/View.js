"use strict";

const path = require('path');

const Boing = require('boing').Boing;


const View = {

    SimpleView(src) {
        let view = path.join(Boing.dirs.views, src);

        return function* () {
            this.render(view);
        };
    },

    render(response, view, data, opts) {
        // FIXME
        console.log('TODO: render %s', view, {data, opts});

        response.body = 'TODO';

        return true;
    },

};

exports = module.exports = View;
