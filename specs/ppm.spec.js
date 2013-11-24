
var path = require('path');

var PluginManager = require('../src/ppm');

var specsPath = path.resolve(__dirname);

describe('Core', function() {

	beforeEach(function() {
		PluginManager.reset();
	});

	describe('Registering Plugins', function() {

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


	describe('Initializing Plugins', function() {

		beforeEach(function(done) {
			PluginManager.registerMany(specsPath + '/ppm-fixtures/', context).start(done);
		});

		it('should have run SYNC initialization', function() {
			expect(context).to.have.property('init1');
		});

		it('should have run ASYNC initialization', function() {
			expect(context).to.have.property('init2');
		});

	});


	describe('Running Plugins', function() {

		beforeEach(function(done) {
			PluginManager.registerMany(specsPath + '/ppm-fixtures/').start(done);
		});

		/**
		 * waterfall test that every involved callbacks return their
		 * first param so its value will preserved to the outcome
		 */
		it('should run waterfall logic', function() {
			expect(
				PluginManager.waterfall('foo1', 5)
			).to.equal(5);
		});


		it('parallel() should run asynchronous series callbacks logic', function(done) {
			PluginManager.parallel('async1', function() {
				done();
			});
		});

		it('run() should run synchronous serialized callbacks logic', function(done) {
			var list = [];
			PluginManager.run('series1', list, function() {
				expect(list).to.deep.equal([
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

		beforeEach(function(done) {
			PluginManager.registerMany(specsPath + '/ppm-fixtures/').start(done);
		});

		it('ppm.waterfall() should be stoppable', function() {
			expect(
				PluginManager.waterfall('testStopWaterfall', 0)
			).to.equal(1);
		});

		it('ppm.async() should be stoppable', function(done) {
			var list = [];
			PluginManager.parallel('testStopAsync', list, function() {
				expect(list.length).to.equal(1);
				done();
			});
		});

		it('ppm.asyncSeries() should be stoppable', function(done) {
			var list = [];
			PluginManager.run('testStopAsyncSeries', list, function() {
				expect(list.length).to.equal(1);
				done();
			});
		});

	});


});