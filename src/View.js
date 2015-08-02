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
        // FIXME: Make the template engine configurable.

        view = view + '.swig.html';

        try {
            response.body = swig.renderFile(view, data);

            return true;
        }
        catch (er) {
            console.error(er.message);
        }

        return false;
    },

};

exports = module.exports = View;
