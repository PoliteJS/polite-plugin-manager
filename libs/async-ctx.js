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

module.exports = AsyncCtx;