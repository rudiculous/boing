"use strict";

function BaseController(context) {
    this._context = context;

    Object.defineProperties(this, {
        req: {
            enumerable: true,
            get: function get() {
                return context.req;
            },
        },
        body: {
            enumerable: true,
            get: function get() {
                return context.body;
            },
            set: function set(val) {
                context.body = val;
            },
        },
    });
}

exports = module.exports = BaseController;
