
var PluginManager = require('../src/ppm'),
	PluginNameError = require('../src/errors/plugin-name-error'),
	PluginCallbackError = require('../src/errors/plugin-callback-error');

describe('Custom Errors', function() {

	beforeEach(function(done) {
		PluginManager.reset().start(done);
	});

	describe('PluginNameError', function() {

		it('ppm.waterfall() throw a PluginNameError if no args', function() {
			expect(
				PluginManager.waterfall
			).to.throw(PluginNameError);
		});

		it('ppm.parallel() throw a PluginNameError if no args', function() {
			expect(
				PluginManager.parallel
			).to.throw(PluginNameError);
		});

		it('ppm.run() throw a PluginNameError if no args', function() {
			expect(
				PluginManager.run
			).to.throw(PluginNameError);
		});

	});


	describe('PluginCallbackError', function() {

		it('ppm.parallel() throw a PluginCallbackError if no callback was given', function() {
			expect(function() {
				PluginManager.parallel('foo');
			}).to.throw(PluginCallbackError);
		});

		it('ppm.parallel() throw a PluginCallbackError if no VALID callback was given', function() {
			expect(function() {
				PluginManager.parallel('foo', 'thisIsNotACallback');
			}).to.throw(PluginCallbackError);
		});

		it('ppm.run() throw a PluginCallbackError if no callback was given', function() {
			expect(function() {
				PluginManager.run('foo');
			}).to.throw(PluginCallbackError);
		});

		it('ppm.run() throw a PluginCallbackError if no VALID callback was given', function() {
			expect(function() {
				PluginManager.run('foo', 'thisIsNotACallback');
			}).to.throw(PluginCallbackError);
		});

	});

});