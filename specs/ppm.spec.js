
var path = require('path');

var PluginManager = require('../src/ppm');

var specsPath = path.resolve(__dirname);

describe('Core', function() {

	beforeEach(function() {
		PluginManager.reset();
	});

	describe('Register Plugins', function() {

		it('should register a single hook', function() {
			expect(
				PluginManager.registerHook('foo', function() {})
			).to.equal(PluginManager);
		});

		it('should register a package by path', function() {
			expect(
				PluginManager.registerPackage(specsPath + '/ppm-fixtures/plugin01')
			).to.equal(PluginManager);
		});

	});


	describe('Run Plugins', function() {

		var context = null;

		beforeEach(function() {
			context = {
				num: 0,
				list: [],
				obj: {}
			};
			PluginManager.registerMany(specsPath + '/ppm-fixtures/', context);
		});

		it('should have run SYNC initialization', function(done) {
			PluginManager.start(function() {
				expect(context).to.have.property('init1');
				done();
			});
		});

		it('should have run ASYNC initialization', function(done) {
			PluginManager.start(function() {
				expect(context).to.have.property('init2');
				done();
			});
		});

		/**
		 * waterfall test that every involved callbacks return their
		 * first param so its value will preserved to the outcome
		 */
		it('should run waterfall logic', function(done) {
			PluginManager.start(function() {
				expect(
					PluginManager.waterfall('foo1', 5)
				).to.equal(5);
				done();
			});
		});


		it('should run asynchronous parallel callbacks logic', function(done) {
			PluginManager.start().async('async1', function() {
				done();
			});
		});

		it('should run synchronous serialized scallbacks logic', function(done) {
			PluginManager.start().asyncSeries('series1', function() {
				expect(context.list).to.deep.equal([
					'plugin02',
					'plugin01'
				]);
				done();
			});
		});

	});


	/**
	 * In this block I test callbacks to be able to prevent
	 * following plugins to run
	 */
	describe('Interrupt Plugins Queue By Callback', function() {

		var context = null;

		beforeEach(function(done) {
			context = {
				num: 0,
				list: [],
				obj: {}
			};
			PluginManager.registerMany(specsPath + '/ppm-fixtures/', context).start(function() {
				done();
			});
		});

		it('ppm.waterfall() should be stoppable', function() {
			expect(
				PluginManager.waterfall('testStopWaterfall', 0)
			).to.equal(1);
		});

		it('ppm.async() should be stoppable', function(done) {
			var list = [];
			PluginManager.async('testStopAsync', list, function() {
				console.log(list);
				expect(list.length).to.equal(1);
				done();
			});
		});

		it('ppm.asyncSeries() should be stoppable', function(done) {
			var list = [];
			PluginManager.async('testStopAsyncSeries', list, function() {
				console.log(list);
				expect(list.length).to.equal(1);
				done();
			});
		});


	});


});