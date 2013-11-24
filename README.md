polite-plugin-manager
=====================

> A cool plugin manager for your _NodeJS_ projects!

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

### Register Many Packages

### Package Structure

```
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

## Hook Types

### run('hook-name', [arg1], [...], [argN], callback)

> Run registered callbacks in series.

Execution order is granted to be the exact registration order. Each callback starts only after the previous one ends.

It support both sinchronous and asyncronous callbacks(see below how to implement an asynchronous callback).

### parallel('hook-name', [arg1], [...], [argN], callback)

> Run registered callbacks in parallel.

It support both sinchronous and asyncronous callbacks(see below how to implement an asynchronous callback) but it is highly recommend to avoid sinchronous callbacks in this hook types because they would slow down execution!


### waterfall('hook-name')

```
// use a waterfall hook as normal function:
var sum = PluginManager.waterfall('sum', 0);
```

A _waterfall_ callback must always return a value. That value will become the first argument of the following registered callback.

```
PluginManager.registerHook('sum', function(tot) {
    tot += 1;
    return tot;
});
```

## Advanced Topics

### Asynchronous Callbacks

Asynchronous callbacks needs to explicitly communicate the end of their stuff.

```
PluginManager.registerHook('hook-name', function() {
    var done = this.async();
    doAsyncFunction(function() {
        done();
    });
});
```

If your callback do not uses any asynchronous APIs but it is meant to run by a **parallel hook** then it is highly recommend to make it asynchronous anyway.

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