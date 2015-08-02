"use strict";

const path = require('path');

const escapeRE = require('escape-regexp');

const Boing = require('./Boing');
const er = require('./errors');


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

        if (!uri.startsWith('/')) {
            uri = '/' + uri;
        }

        this._method = method;
        this._uri = uri;
        this._target = target;

        let parsedUri = this._parseUri(uri);
        this._pattern = parsedUri.re;
        this._paramKeys = parsedUri.keys;

        if (typeof(target) === 'string') {
            let parts = target.split('#');
            this._controllerPath = path.join(Boing.dirs.controllers, parts[0]);
            this._Controller = require(this._controllerPath);
            this._method = parts[1];
        }
    }

    match(request) {
        return this._pattern.exec(request.url);
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

        if (typeof(this._target) === 'function') {
            fn = this._target;
        }
        else {
            let controller = context = new this._Controller(context);
            fn = controller[this._method];
        }

        if (fn == null) {
            return;
        }

        // Parse the function signature, to extract arguments.
        let sig = fn.toString().match(/\(([^)]*)\)/);
        let args = [];

        if (sig) {
            for (let key of sig[1].split(/ *, */g)) {
                if (key === 'request') key = 'req';
                if (key === 'response') key = 'res';

                if (params[key] != null) {
                    args.push(params[key]);
                }
                else if (orgContext[key] != null) {
                    args.push(orgContext[key]);
                }
                else if (context[key] != null) {
                    args.push(context[key]);
                }
            }
        }

        yield* fn.apply(context, args);
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

exports = module.exports = Route;
