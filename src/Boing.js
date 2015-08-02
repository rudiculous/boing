"use strict";

const path = require('path');

const chalk = require('chalk');
const koa = require('koa');
let Router; // loaded on initialize

const er = require('./errors');


let _initialized = false;
let _router = null;


function* Boing(next) {
    let res = Router.resolve(_router, this.path, this.req);

    if (res.status != null) {
        this.status = res.status;
    }

    if (res.resolved == null) {
        yield next;
    }
    else {
        yield* resolved.route.run(this, resolved.params);
    }
}


Boing.initialize = function initialize(rootDir) {
    Router = require('./Router');
    rootDir = path.resolve(rootDir);
    let appDir = path.join(rootDir, 'app');

    Boing.dirs = {
        root: rootDir,
        app: appDir,
        controllers: path.join(appDir, 'controllers'),
        middleware: path.join(appDir, 'middleware'),
        models: path.join(appDir, 'models'),
        views: path.join(appDir, 'views'),
    };

    require(path.join(rootDir, 'routes'));

    _initialized = true;

    return Boing;
};

Boing.run = function run(port, host) {
    if (port == null) port = 3072;

    let app = koa();
    app.use(Boing);

    let server = app.listen(port, host, function () {
        console.log('Application running on %s:%s.',
            chalk.yellow(server.address().address),
            chalk.yellow(server.address().port));
    });
};

Object.defineProperties(Boing, {
    router: {
        enumerable: true,
        get: function get() {
            return _router;
        },
        set: function set(val) {
            // FIXME: Check if val is a valid Router!
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
