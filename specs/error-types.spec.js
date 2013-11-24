
var PluginManager = require('../src/ppm'),
	PluginNameError = require('../src/errors/plugin-name-error'),
	PluginCallbackError = require('../src/errors/plugin-callback-error');

describe('Custom Errors', function() {

	beforeEach(function() {
		PluginManager.reset();
	});

	describe('PluginNameError', function() {

		it('ppm.waterfall() throw a PluginNameError if no args', function() {
			expect(
				PluginManager.waterfall
			).to.throw(PluginNameError);
		});

		it('ppm.async() throw a PluginNameError if no args', function() {
			expect(
				PluginManager.async
			).to.throw(PluginNameError);
		});

		it('ppm.asyncSeries() throw a PluginNameError if no args', function() {
			expect(
				PluginManager.asyncSeries
			).to.throw(PluginNameError);
		});

	});


	describe('PluginCallbackError', function() {

		it('ppm.async() throw a PluginCallbackError if no callback was given', function() {
			expect(function() {
				PluginManager.async('foo');
			}).to.throw(PluginCallbackError);
		});

		it('ppm.async() throw a PluginCallbackError if no VALID callback was given', function() {
			expect(function() {
				PluginManager.async('foo', 'thisIsNotACallback');
			}).to.throw(PluginCallbackError);
		});

		it('ppm.asyncSeries() throw a PluginCallbackError if no callback was given', function() {
			expect(function() {
				PluginManager.asyncSeries('foo');
			}).to.throw(PluginCallbackError);
		});

		it('ppm.asyncSeries() throw a PluginCallbackError if no VALID callback was given', function() {
			expect(function() {
				PluginManager.asyncSeries('foo', 'thisIsNotACallback');
			}).to.throw(PluginCallbackError);
		});

	});

});