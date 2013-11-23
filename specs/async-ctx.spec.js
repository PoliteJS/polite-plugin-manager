
var AsyncCtx = require('../src/libs/async-ctx');

describe('AsyncCtx', function() {

	var instance = null,
		callback = function() {
			return true;
		}

	beforeEach(function() {
		instance = new AsyncCtx(callback);
	});

	it('should define a "sync" mode as default behavior', function() {
		expect(
			instance.sync
		).to.be.true;
	});

	it('should switch to "async" mode', function() {
		instance.async();
		expect(
			instance.sync
		).to.be.false;
	});

	it ('should run given callback when switch to "async" mode', function() {
		var asyncCallback = instance.async();
		expect(
			asyncCallback()
		).to.be.true;
	});

});