polite-plugin-manager
=====================

> A cool plugin manager for your _NodeJS_ projects!

_Polite Plugin Manager_ is an atomic library with which **add plugin capabilities** to any _NodeJS_ project enhancing **behavior scalability**.

Key points during the developent of this library were:

- to be ridicolous easy to declare hooks
- to be ridicolous easy to register plugin packages
- to be ridicolous easy to handle asynchronous plugins

I really think all these points have been reached very well.  
I've also added a really fine grained control on:

- plugins initialization cycle
- series / parallel / waterfall behaviors
- stoppable plugin chain

### What's Next

I want single package hook to expose it's priority:

```
hook1: function() {},

hook2: {
    priority: 2000,
    method: function() {}
}
```

I want to better explore _plugins package organization_ to let a plugin package to spread on multiple files.

I also want to explore **in-plugin package test support** to let every plugin to be fully testable before it's release.

### Tests

To grant code quality I wrote many test for this module!

After run `npm install` to load _all dev-dependencies_ you should run:

```
// run tests
grunt

// run tests and show a test coverage report
grunt specs
```


## Install

The latest version of this package is always published to the _NPM_ repository so it easy to install it by:

```
npm install polite-plugin-manager --save
```

After that you can load an instance into your modules to be able to declare hooks or to load packages:

```
var PluginManager = require('polite-plugin-manager');

// register all plugins within a folder then start the manager
PluginManager.registerMany('/path/to/plugins/').start(function() {
    
    ... your app code ...
    
    // run all hook's registered callbacks
    PluginManager.run('hook-name');
    
    ... your app code ...
    
});
```


## Hooks

### Register Callbacks to Hooks

```
PluginManager.registerHook('hook-name', function(arg1) {
    arg1 += 1;
});
```

### Run Hook's Callbacks

```
var num = 0;
PluginManager.run('hook-name', num, function() {
    console.log(num); // 1
});
```

## Packages

### Register a Package

```
PluginManager.registerPackage('/path/to/plugin-package/');
```

### Register Many Packages

```
PluginManager.registerPackage('/path/to/plugins/');
```

Inside that folders you can place all you `plugin-package` folders. _Polite Plugin Manager_ will load'em all!

### Package Structure

```
/path/to/plugin-package/index.js
module.exports = function(packageContext) {
    return {
        // package identity properties
        name: 'optional package name',
        priority: 500, // default 100
        init: function() {
            ... initialization stuff ...
        },
        
        // register hooks callbacks
        'hook-name': function() {
            ... hook callback stuff ...
        },
        'another-hook-name': function() {
            ... hook callback stuff ...
        }
    };
};
```

### Package Initialization

You plugin's package `init()` function executes when `PluginManager.start()`.

If you need to run _asynchronous_ logic then you need to reference to a `done()` callback to use when your stuff are done:

```
init: function() {
    var done = this.async();
    ... async stuff ...
    done();
}
```


## Hook Types

### run('hook-name', [arg1], [...], [argN], callback)

> Run registered callbacks in series.

**Execution order is granted** to be the exact registration order (`priority` package property). Each callback starts only after the previous one ends.

It support both _sinchronous_ and _asynchronous_ callbacks(see below how to implement an _asynchronous_ callback).

### parallel('hook-name', [arg1], [...], [argN], callback)

> Run registered callbacks in parallel.

It support both _sinchronous_ and _asyncronous_ callbacks(see below how to implement an _asynchronous_ callback) but it is highly recommend to avoid _sinchronous_ callbacks in this hook types because they would slow down execution!


### waterfall('hook-name')

```
// use a waterfall hook as normal function:
var sum = PluginManager.waterfall('sum', 0);
```

A _waterfall_ callback must always return a value. That value will become the first argument of the following registered callback.

> Waterfall's callbacks are always _synchronous_!

```
PluginManager.registerHook('sum', function(tot) {
    tot += 1;
    return tot;
});
```

## Advanced Topics

### Asynchronous Callbacks

_Asynchronous_ callbacks needs to explicitly communicate the end of their stuff.

```
PluginManager.registerHook('hook-name', function() {
    var done = this.async();
    doAsyncFunction(function() {
        done();
    });
});
```

If your callback do not uses any _asynchronous_ APIs but it is meant to run by a **parallel hook** then it is highly recommend to make it _asynchronous_ anyway to avoid block other callbacks startup!

A very simple way to obtain this behavior is the `setTimeout` function:

```
PluginManager.registerHook('hook-name', function() {
    var done = this.async();
    setTimeout(function() {
        done();
    }, 0);
});
```

This callback will release control immediately letting other callbacks to begin their execution. 

[If you want to learn more about Asynchronous Javascript programmin you can click here!](http://sandervanderburg.blogspot.se/2013/07/asynchronous-programming-with-javascript.html)  
(temporary link)

### Prevent Following Callbacks Execution

#### synchronous

```
PluginManager.registerHook('hook-name', function() {
    ... do something ...
    this.stop();
});
```

#### asynchronous

```
PluginManager.registerHook('hook-name', function() {
    var done = this.async();
    fs.exists('/test/path', function(exists) {
        if (exists) {
            
            // prevent other callbacks to run:
            done(true);
            
        } else {
            // allow other callbacks to run
            done();
        }
    });
});
```

you can detect if an _asyncronous_ callback queque have been stopped:

```
PluginManager.run('foo', function(err) {
    if (err === true) {
        // stopped with standard stop API
    } else if (err instanceof Error) {
        // stopped by some callback's error
    }
});
```


### Detect Empty Hook

If you feel important to know if some plugins have been executed under certain hooks you can:

```
/**
 * explicitly detection:
 */
if (PluginManager.isEmpty('hook-name')) {
    // yes it is!
} else {
    // no, something will be executed if you run it!
}

/**
 * after execution detection:
 */
var hasExecutedCallbacks = PluginManager.run('foo', function(err) {
    if (err === false) {
        // no callbacks were executed
    }
});

if (hasExecutedCallbacks === false) {
    // no callbacks were executed
}
```

