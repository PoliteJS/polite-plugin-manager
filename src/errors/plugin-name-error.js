
function PluginNameError(message) {
	this.name = "PluginNameError";
	this.message = (message || "");
}


PluginNameError.prototype = new Error();
PluginNameError.prototype.constructor = PluginNameError;

module.exports = PluginNameError;