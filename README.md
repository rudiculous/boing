# boing
A Rails-inspired MVC for ES6.

## Usage
Eventually Boing will have generators, so you can easily add controllers
and other stuff. For now, you have to manually set up your project. Your
project should look like this:

    project_root/
      app/
        controllers/
          base.coffee
        middleware/
        models/
        views/
      config/
        initializers/
        database.yml
      db/
      public/
      package.json
      routes.coffee
      server.js

I recommend using CoffeeScript, due to its friendlier syntax.

You can find a sample project in the directory `example`.


## Engine
Since this package uses a number of ES6 features, you need to use an
engine that is capable of using these features. The following features
are used:
* `let` and `const`
* ES6 classes
* Shorthand property names
* Generators

I recommend using this package with [io.js](https://iojs.org/), version
2.0 or higher.


## DISCLAIMER
This package is a hobby project, and at its current state not usable for
production. Everything is subject to change.
