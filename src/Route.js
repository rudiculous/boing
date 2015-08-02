"use strict";

const path = require('path');

const escapeRE = require('escape-regexp');

const Boing = require('./Boing');
const er = require('./errors');
const View = require('./View');


const methods = [
    'get',
    'post',
    'put',
    'delete',
    'head',
];

const _pattern = /\\\:([A-Za-z_][A-Za-z0-9_]*)/;

class Route {

    static get methods() {
        return methods;
    }

    constructor(method, uri, target) {
        if (Boing.dirs == null) {
            throw new er.NotInitializedError('Boing has not yet been initialized.');
        }

        // TODO: Should we accept RegExps for uri?

        if (!uri.startsWith('/')) {
            uri = '/' + uri;
        }

        this._method = method.toLowerCase();
        this._uri = uri;
        this._target = target;

        let parsedUri = this._parseUri(uri);
        this._pattern = parsedUri.re;
        this._paramKeys = parsedUri.keys;

        if (typeof(target) === 'string') {
            let parts = target.split('#');
            this._controllerPath = path.join(Boing.dirs.controllers, parts[0]);
            this._Controller = require(this._controllerPath);
            this._action = parts[1];
            this._view = path.join(Boing.dirs.views, parts[0], this._action);
        }
    }

    match(request) {
        let m = this._pattern.exec(request.path);
        let method = request.method.toLowerCase();

        if (m) {
            if (this._method !== '*' && this._method !== method) {
                return {
                    match: null,
                    status: 405,
                };
            }
            else {
                return {
                    match: m,
                    status: 200,
                };
            }
        }
        else {
            return {
                match: null,
                status: 404,
            };
        }
    }

    getParams(match) {
        let params = {};

        for (let i = this._paramKeys.length; i > 0; i -= 1) {
            let key = this._paramKeys[i - 1];
            params[key] = match[i];
        }

        return params;
    }

    *run(context, params) {
        let fn;
        let orgContext = context;
        let query = context.request.query;
        let rendered = false;

        if (typeof(this._target) === 'function') {
            fn = this._target;
        }
        else {
            let controller = context = new this._Controller(context);
            fn = controller[this._action];
        }

        if (fn == null) {
            return;
        }

        let args = [];
        for (let key of _getFunctionSignature(fn)) {
            if (key === 'params') {
                args.push(params);
            }
            else if (params[key] != null) {
                args.push(params[key]);
            }
            else if (query[key] != null) {
                args.push(query[key]);
            }
            else if (orgContext[key] != null) {
                args.push(orgContext[key]);
            }
            else if (context[key] != null) {
                args.push(context[key]);
            }
            else {
                args.push(null);
            }
        }

        let _this = this;
        let data = {};
        Object.defineProperties(context, {
            data: {
                enumerable: true,
                get() {
                    return data;
                },
                set(val) {
                    for (let key of Object.keys(val)) {
                        data[key] = val[key];
                    }
                },
            },
            render: {
                enumerable: true,
                get() {
                    return function render(view, opts) {
                        if (_this._view == null) {
                            if (view == null) {
                                console.error('Unable to determine view.', _this);
                                return false;
                            }

                            if (opts == null) {
                                opts = {};
                            }
                        }
                        else {
                            if (view == null) {
                                view = _this._view;
                            }
                            else if (typeof(view) !== 'string') {
                                opts = view;
                                view = _this._view;
                            }

                            if (opts == null) {
                                opts = {};
                            }
                        }

                        rendered = View.render(orgContext.response, view, data, opts);

                        return rendered;
                    };
                },
            },
        });

        if (fn.constructor.name === 'GeneratorFunction') {
            yield* fn.apply(context, args);
        }
        else {
            fn.apply(context, args);
        }

        if (!rendered) {
            context.render();
        }
    }

    _parseUri(uri) {
        let re = escapeRE(uri);
        let paramKeys = [];

        let match;
        while ( (match = _pattern.exec(re)) != null) {
            re = re.replace(_pattern, '([^\\/]+)');
            paramKeys.push(match[1]);
        }

        return {
            re: new RegExp('^' + re + '$'),
            keys: paramKeys,
        };
    }

}


function _getFunctionSignature(fn) {
    let str = fn.toString();

    // Strip comments.
    str = str.replace(/\/\/[^\r\n]*|\/\*[\s\S]*?\*\//g, '');

    let match = str.match(/\(([^)]*)\)/);

    if (match) {
        let sig = match[1].split(/\s*,\s*/);

        if (sig.length === 1 && !sig[0]) {
            sig.length = 0;
        }

        let signature = [];

        for (let key of sig) {
            // TODO: Handle rest parameters. The position of the rest
            // parameter matters, so this requires some thought. The
            // following signatures are all different:
            // * function (...rest, foo, bar)
            // * function (foo, ...rest, bar)
            // * function (foo, bar, ...rest)
            // For now, just ignore rest parameters...
            if (key.indexOf('...') === 0) {
                continue;
            }

            // If there is a default value defined, remove it from the
            // key.
            key = key.replace(/\s*=.*$/, '');

            // TODO: Should we do something with destructuring
            // assignments?

            signature.push(key);
        }

        return signature;
    }
    else {
        return [];
    }
}

exports = module.exports = Route;
