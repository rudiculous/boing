"use strict";

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

class Router {

    static draw(routes) {
        Boing.router = new Router();
        routes.call(Boing.router);
    }

    static resolve(inst, request) {
        return inst._resolve(request);
    }

    constructor() {
        this._routes = [];
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

    _getTargetFromUri(uri) {
        let li = uri.lastIndexOf('/');
        return uri.substring(0, li) + '#' + uri.substring(li + 1);
    }

    _registerRoute(method, uri, target) {
        if (target == null) {
            target = this._getTargetFromUri(uri);
        }

        this._routes.push(new Route(method, uri, target));
    }

    _resolve(request) {
        for (let route of this._routes) {
            let match = route.match(request);
            if (match) {
                let params = route.getParams(match);

                return {route, match, params};
            }
        }
    }

}

for (let method of Route.methods) {
    Router.prototype[method] = function (uri, target) {
        this._registerRoute(method, uri, target);
    }
}

exports = module.exports = Router;
