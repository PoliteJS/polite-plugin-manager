/**
 * Polite Plugin Manager
 * register and run hooks granting extendability
 *
 */


// Global Dependencies
var fs = require('fs'),
	path = require('path'),
	extend = require('extend'),
	async = require('async'),

// Local Modules
	AsyncCtx = require('./libs/async-ctx'),
	WaterfallCtx = require('./libs/waterfall-ctx'),
	PluginNameError = require('./errors/plugin-name-error'),
	PluginCallbackError = require('./errors/plugin-callback-error');


// ------------------------------------------------------------------------------------ //
// ---[[   C O N S T R U C T O R   A N D   L I F E C Y C L E   U T I L I T I E S   ]]-- //
// ------------------------------------------------------------------------------------ //

var packages = [],
	hooks = {};

module.exports.reset = function () {
	packages = [];
	hooks = {};
	return this;
};

/**
 * Apply package sorting,
 * register packages into hooks,
 * run packages init() method
 */
module.exports.start = function (callback) {

	var self = this,
		inits = [],
		skipProps = ['name', 'priority', 'init'];

	// sort by priorities
	packages.sort(function (a, b) {
		return a.priority > b.priority;
	});

	// register init & hooks
	// hooks are all functions who are not special properties
	// identified by "skipProps" list
	packages.forEach(function (pkg) {
		if (pkg.init) {
			inits.push(pkg.init);
		}
		for (prop in pkg) {
			if (skipProps.indexOf(prop) === -1 && typeof pkg[prop] == 'function') {
				module.exports.registerHook(prop, pkg[prop]);
			}
		}
	});

	// run all package.init() method in series!
	if (inits.length) {
		async.eachSeries(inits, function (fn, done) {

			var context = new AsyncCtx(done),
				result = fn.apply(context);

			// sync false stop initialization cycle!
			if (context.sync) {
				if (result === false) {
					callback.call(self);
				} else {
					done(result);
				}
			}

		}, callback.bind(this));
	} else {
		callback.call(self);
	}

	return this;
};









// --------------------------------- //
// ---[[   H O O K S   A P I   ]]--- //
// --------------------------------- //

module.exports.registerHook = function (hookName, hookFn) {
	if (!hooks[hookName]) {
		hooks[hookName] = [];
	}
	hooks[hookName].push(hookFn);
	return this;
};


module.exports.isEmpty = function(hookName) {
	if (hooks[hookName] && hooks[hookName].length) {
		return false;
	} else {
		return true;
	}
};



/**
 * Run registered hook callbacks in series
 * (it supports asynchronous callbacks)
 */
module.exports.run = function () {

	var hookName = '',
		callback = null,
		args = Array.prototype.slice.call(arguments);

	// collect hookName property
	if (!args.length) {
		throw new PluginNameError('missing plugin name!');
	} else {
		hookName = args.shift();
	}

	// obtain async callback
	if (!args.length || typeof args[args.length - 1] !== 'function') {
		throw new PluginCallbackError('[' + hookName + '] missing callback for async plugin!');
	} else {
		callback = args[args.length - 1];
	}

	// check for some callbacks existance
	// [???] may give out an exception when no callbacks were found!
	if (!hooks[hookName] || !hooks[hookName].length) {
		callback(false);
		return false;
	}

	// run async queque
	// NOTE: a step function should stop the queque by done(true)
	async.eachSeries(hooks[hookName], function (fn, done) {
		var context = new AsyncCtx(done),
			result = fn.apply(context, args);

		if (context.sync) {
			if (result === false) {
				callback();
			} else {
				done(result);
			}
		}
	}, callback);

	return true;
};

/**
 * Run registered hook callbacks in parallel
 * (it supports asynchronous callbacks)
 * @param hookName
 */

module.exports.parallel = function () {

	var hookName = '',
		callback = null,
		args = Array.prototype.slice.call(arguments);

	// collect hookName property
	if (!args.length) {
		throw new PluginNameError('missing plugin name!');
	} else {
		hookName = args.shift();
	}

	// obtain async callback
	if (!args.length || typeof args[args.length - 1] !== 'function') {
		throw new PluginCallbackError('[' + hookName + '] missing callback for async plugin!');
	} else {
		callback = args[args.length - 1];
	}

	// check for some callbacks existance
	// [???] may give out an exception when no callbacks were found!
	if (!hooks[hookName] || !hooks[hookName].length) {
		callback(false);
		return false;
	}

	// run async in parallel
	// NOTE: a step function should stop the queque by done(true)
	async.each(hooks[hookName], function (fn, done) {
		var context = new AsyncCtx(done),
			result = fn.apply(context, args);

		// handle sync callbacks
		if (context.sync) {
			done(result);
		}
	}, callback);

	return true;
};


/**
 * WATERFALL
 * Run a hook as a normal function in a fully syncronous mode
 * Each hookFn should return a value who's forward as first argument for the next one
 * last hookFn return value is the final output
 */
module.exports.waterfall = function (hookName) {

	if (!hookName) {
		throw new PluginNameError('missing plugin name!');
	}

	var args = Array.prototype.slice.call(arguments);
	args.shift();

	if (hooks[hookName]) {
		// use known exception to exit forEach cycle implementing a stoppable watefall
		// (http://stackoverflow.com/questions/2641347/how-to-short-circuit-array-foreach-like-calling-break?answertab=votes#tab-top)
		var WaterfallBreakException = {};
		try {
			hooks[hookName].forEach(function (fn) {
				var context = new WaterfallCtx(),
					result = fn.apply(context, args);

				if (args.length) {
					args[0] = result;
				}

				if (context.stopped) {
					throw WaterfallBreakException;
				}

			});
		} catch (e) {
			if (e !== WaterfallBreakException) throw e;
		}
	}

	if (args.length) {
		return args[0];
	} else {
		return;
	}
};













// --------------------------------------- //
// ---[[   P A C K A G E S   A P I   ]]--- //
// --------------------------------------- //

/**
 * Load a plugin package by folder path
 * @param sourceFolder
 */
module.exports.registerPackage = function (sourceFolder, context) {

	var name = path.basename(sourceFolder),
		module = require(sourceFolder),

	// obtain package informations and apply some default values
		pkg = extend({
			"name" : name,
			"priority" : 100,
			"init" : function() {}
		}, module(context || {}));

	// skip disabled plugins (_plugin)
	if (name.substring(0, 1) == '_') {
		return this;
	}

	packages.push(pkg);
	return this;
};


/**
 * Load all packages from a given folder path
 * (syncronous)
 */
module.exports.registerMany = function (sourceFolder, context) {
	var self = this;

	if (fs.existsSync(sourceFolder)) {
		fs.readdirSync(sourceFolder).forEach(function (item) {
			var itemPath = sourceFolder + '/' + item,
				itemStat = fs.lstatSync(itemPath);

			if (itemStat.isDirectory()) {
				self.registerPackage(itemPath, context);
			}
		});
	}

	return this;
};


