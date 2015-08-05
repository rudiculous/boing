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


## DISCLAIMER
This package is a hobby project, and at its current state not usable for
production. Everything is subject to change.
