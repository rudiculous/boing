"use strict";

const path = require('path');

const swig = require('swig');

const Boing = require('boing').Boing;


const View = {

    SimpleView(src) {
        let view = path.join(Boing.dirs.views, src);

        return function* () {
            this.render(view);
        };
    },

    render(response, view, data, opts) {
        // TODO: Make the template engine configurable.
        response.body = swig.renderFile(view + '.swig.html', data);

        return true;
    },

};

exports = module.exports = View;
