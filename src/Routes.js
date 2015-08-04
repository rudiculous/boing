"use strict";

const path = require('path');

const compose = require('koa-compose');

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

class Routes {

    static draw(routes) {
        Boing.router = new Routes();
        routes.call(Boing.router.getContext());
        Boing.router._mwComposed = compose(Boing.router._middlewares);
    }

    constructor() {
        this._routes = [];
        this._middlewares = [];
    }

    getContext() {
        let self = this;
        let context = {
            root(target) {
                context.get('/', target);
            },

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

                    self.registerRoute(
                        mapping.method,
                        opts.uri + mapping.uri,
                        baseTarget + resource
                    );
                }
            },

            namespace(name, routes) {
                throw new Error('Not yet implemented');
            },

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

                self._middlewares.push(mw);
            },
        };

        for (let method of Route.methods) {
            context[method] = function (uri, target) {
                self.registerRoute(method, uri, target);
            }
        }

        return context;
    }

    getTargetFromUri(uri) {
        let li = uri.lastIndexOf('/');
        return uri.substring(0, li) + '#' + uri.substring(li + 1);
    }

    registerRoute(method, uri, target) {
        if (target == null) {
            target = this.getTargetFromUri(uri);
        }

        this._routes.push(new Route(method, uri, target));
    }

    resolve(request) {
        let returnCode = 404;

        for (let route of this._routes) {
            let res = route.match(request);
            if (res.match) {
                let match = res.match;
                let params = route.getParams(match);

                return {
                    resolved: {route, match, params},
                    status: res.status,
                };
            }
            else if (res.status === 405) {
                returnCode = 405;
            }
        }

        return {
            resolved: null,
            status: returnCode,
        };
    }

    *middleware(context, next) {
        yield* this._mwComposed.call(context, next);
    }

}

exports = module.exports = Routes;
