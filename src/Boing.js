"use strict";

const path = require('path');

const chalk = require('chalk');
const koa = require('koa');
const serve = require('koa-static');

let Routes; // loaded on initialize
let View; // loaded on initialize

const er = require('./errors');


let _app;
let _initialized = false;
let _router = null;


function* Boing(next) {
    let res = Routes.resolve(_router, this.request);

    if (res.status != null) {
        this.status = res.status;
    }

    if (res.resolved == null) {
        yield* next;
    }
    else {
        yield* Routes.middleware(
            _router, this,
            res.resolved.route.run(this, res.resolved.params)
        );
    }
}


Boing.initialize = function initialize(rootDir, app) {
    Boing.initialize = function() {
        console.warn('Boing has already been initialized!');
        return Boing;
    };

    Routes = require('./Routes');
    View = require('./View');

    rootDir = path.resolve(rootDir);
    let appDir = path.join(rootDir, 'app');

    Boing.dirs = {
        root: rootDir,
        app: appDir,
        controllers: path.join(appDir, 'controllers'),
        middleware: path.join(appDir, 'middleware'),
        models: path.join(appDir, 'models'),
        views: path.join(appDir, 'views'),
        public: path.join(rootDir, 'public'),
    };

    require(path.join(rootDir, 'routes'));

    if (app == null) {
        _app = koa();
    }
    else {
        _app = app;
    }

    _app.use(Boing);
    _app.use(serve(Boing.dirs.public));

    _initialized = true;

    return Boing;
};

Boing.listen = function listen(port, host) {
    let server;

    let args = Array.prototype.slice.call(arguments);
    args.push(function () {
        console.log('Application running on %s:%s.',
            chalk.yellow(server.address().address),
            chalk.yellow(server.address().port));
    });

    server = _app.listen.apply(_app, args);
};

Object.defineProperties(Boing, {
    app: {
        enumerable: true,
        get() {
            return _app;
        },
    },
    router: {
        enumerable: true,
        get() {
            return _router;
        },
        set(val) {
            // FIXME: Check if val is a valid Routes object!
            _router = val;
        },
    },
});

Boing.testInitialized = function testInitialized() {
    if (!_initialized) {
        throw new er.NotInitializedError('Boing has not yet been initialized.');
    }
};

exports = module.exports = Boing;
