
var WaterfallCtx = require('../src/libs/waterfall-ctx');

describe('WaterfallCtx', function() {

	var instance = null;

	beforeEach(function() {
		instance = new WaterfallCtx();
	});

	it('should define not be stopped by default', function() {
		expect(
			instance.stopped
		).to.be.false;
	});

	it('should be stopped by api', function() {
		instance.stop();
		expect(
			instance.stopped
		).to.be.true;
	});

});