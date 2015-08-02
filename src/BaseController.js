"use strict";

/* The BaseController is deliberatly not an ES6 class. This is because
 * ES6 classes don't play nice with CoffeeScript classes. ES6 classes
 * may only be constructed with the `new` keyword, while CoffeeScript
 * classes, when extending another class, construct their parent by
 * explicitely calling the parent constructor. This means that
 * CoffeeScript classes cannot extend ES6 classes.
 *
 * Since the BaseController will be extended by users, who might use
 * CoffeeScript, this means it is not practical to use an ES6 class.
 */
function BaseController(context) {
    Object.defineProperties(this, {
        body: {
            enumerable: true,
            get() {
                return context.body;
            },
            set(val) {
                context.body = val;
            },
        },
        context: {
            enumerable: true,
            get() {
                return context;
            },
        },
        response: {
            enumerable: true,
            get() {
                return context.response;
            },
        },
        request: {
            enumerable: true,
            get() {
                return context.request;
            },
        },
        query: {
            enumerable: true,
            get() {
                return context.query;
            },
        },
    });
}

exports = module.exports = BaseController;
