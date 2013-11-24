
function PluginCallbackError(message) {
	this.name = "PluginCallbackError";
	this.message = (message || "");
}


PluginCallbackError.prototype = new Error();
PluginCallbackError.prototype.constructor = PluginCallbackError;

module.exports = PluginCallbackError;