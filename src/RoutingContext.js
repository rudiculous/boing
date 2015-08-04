"use strict";

const path = require('path');

const Boing = require('./Boing');
const Route = require('./Route');


const resourceMapping = {
    index: {
        method: 'get',
        uri: '',
    },
    new: {
        method: 'get',
        uri: '/new',
    },
    create: {
        method: 'post',
        uri: '',
    },
    show: {
        method: 'get',
        uri: '/:id',
    },
    edit: {
        method: 'get',
        uri: '/:id/edit',
    },
    update: {
        method: 'put',
        uri: '/:id',
    },
    destroy: {
        method: 'delete',
        uri: '/:id',
    },
};

class RoutingContext {

    constructor(namespace, registerRoute, registerMiddleware) {
        this._namespace = namespace;
        this._registerRoute = registerRoute;
        this._registerMiddleware = registerMiddleware;
    }

    root(target) {
        this.get('/', target);
    }

    resources(name, opts) {
        if (opts == null) opts = {};
        if (opts.uri == null) opts.uri = '/' + name;
        if (opts.controller == null) opts.controller = name;
        if (opts.only == null) opts.only = [
            'index', 'new', 'create', 'show', 'edit', 'update', 'destroy'
        ];

        if (opts.uri.endsWith('/')) opts.uri = opts.uri.substring(0, opts.uri.length - 1);
        let baseTarget = opts.controller + '#';

        for (let resource of opts.only) {
            let mapping = resourceMapping[resource];

            if (mapping == null) continue;

            this._registerRoute(
                mapping.method,
                opts.uri + mapping.uri,
                baseTarget + resource
            );
        }
    }

    namespace(name, routes) {
        throw new Error('Not yet implemented');
    }

    use(mw) {
        if (typeof(mw) === 'string') {
            mw = require(path.join(Boing.dirs.middleware, mw));
        }
        if (typeof(mw) === 'function' &&
            mw.constructor.name !== 'GeneratorFunction'
        ) {
            let fn = mw;
            mw = function* (next) {
                fn.call(this, next);
                yield* next;
            };
        }

        this._registerMiddleware(mw);
    }

}

for (let method of Route.methods) {
    RoutingContext.prototype[method] = function (uri, target) {
        this._registerRoute(method, uri, target);
    }
}

exports = module.exports = RoutingContext;
