/**
 *
 * @type {{}}
 */

function WaterfallCtx() {
	this.stopped = false;
}

WaterfallCtx.prototype.stop = function() {
	this.stopped = true;
};

module.exports = WaterfallCtx;