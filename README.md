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

### Package Initialization

## Hook Types

### run('hook-name', [arg1], [...], [argN], callback)

### parallel('hook-name', [arg1], [...], [argN], callback)

### waterfall('hook-name')

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