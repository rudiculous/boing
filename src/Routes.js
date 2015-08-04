"use strict";

const compose = require('koa-compose');

const Boing = require('./Boing');
const Route = require('./Route');
const RoutingContext = require('./RoutingContext');


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

        return new RoutingContext(
            null,
            function registerRoute(method, uri, target) {
                self.registerRoute(method, uri, target);
            },
            function registerMiddleware(mw) {
                self._middlewares.push(mw);
            }
        );
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
