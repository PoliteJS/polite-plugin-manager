/**
 *
 * @type {{}}
 */

function AsyncCtx(callback) {
	this.callback = callback;
	this.sync = true;
}

AsyncCtx.prototype.async = function() {
	this.sync = false;
	return this.callback;
};

/**
 * This is an API meant to be used only from synchronous
 * callbacks into an asynchronous like hook.
 *
 * it represent continuity from the "sync()" or "waterfall()"
 * plugin management
 */
AsyncCtx.prototype.stop = function() {
	var callback = this.async();
	callback(true);
};

module.exports = AsyncCtx;