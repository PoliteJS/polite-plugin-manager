
var path = require('path');

var PluginManager = require('../src/ppm');

var specsPath = path.resolve(__dirname);

describe('Core', function() {

	beforeEach(function() {
		PluginManager.reset();
	});




// ----------------------------------------------------- //
// ---[[   R E G I S T E R I N G   P L U G I N S   ]]--- //
// ----------------------------------------------------- //

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






// --------------------------------------------------------- //
// ---[[   P L U G I N   I N I T I A L I Z A T I O N   ]]--- //
// --------------------------------------------------------- //

	describe('Initialize Plugins', function() {

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





// ------------------------- //
// ---[[   R U N ( )   ]]--- //
// ------------------------- //

	describe('run()', function() {

		beforeEach(function(done) {
			PluginManager.registerMany(specsPath + '/ppm-fixtures/').start(done);
		});

		it('run() should run synchronous serialized callbacks logic', function(done) {
			var list = [];
			PluginManager.run('run01', list, function() {
				expect(list).to.deep.equal([
					'plugin02',
					'plugin01'
				]);
				done();
			});
		});

		it('should handle empty hooks', function(done) {
			PluginManager.run('emptyHook', function(err) {
				expect(err).to.be.false;
				done();
			});
		});

		it('should return FALSE on empty hooks', function() {
			expect(
				PluginManager.run('emptyHook', function() {})
			).to.be.false;
		});

		it('should be stoppable', function(done) {
			var list = [];
			PluginManager.run('stoppableRun', list, function() {
				expect(list.length).to.equal(1);
				done();
			});
		});

		it('callback\'s param should be true when stopped', function(done) {
			PluginManager.run('stoppableRun', [], function(err) {
				expect(err).to.be.true;
				done();
			});
		});

	});








// ---------------------------------- //
// --[[   P A R A L L E L ( )   ]]--- //
// ---------------------------------- //

	describe('parallel()', function() {

		beforeEach(function(done) {
			PluginManager.registerMany(specsPath + '/ppm-fixtures/').start(done);
		});

		it('parallel() should run asynchronous series callbacks logic', function(done) {
			PluginManager.parallel('parallel01', function() {
				done();
			});
		});

		it('should handle empty hooks', function(done) {
			PluginManager.parallel('emptyHook', function(err) {
				expect(err).to.be.false;
				done();
			});
		});

		it('should return FALSE on empty hooks', function() {
			expect(
				PluginManager.parallel('emptyHook', function() {})
			).to.be.false;
		});

		it('should be stoppable', function(done) {
			var list = [];
			PluginManager.parallel('stoppableParallel', list, function() {
				expect(list.length).to.equal(1);
				done();
			});
		});

		it('callback\'s param should be true when stopped', function(done) {
			PluginManager.parallel('stoppableParallel', [], function(err) {
				expect(err).to.be.true;
				done();
			});
		});

	});






// ------------------------------------- //
// ---[[   W A T E R F A L L ( )   ]]--- //
// ------------------------------------- //

	describe('waterfall()', function() {

		beforeEach(function(done) {
			PluginManager.registerMany(specsPath + '/ppm-fixtures/').start(done);
		});

		/**
		 * waterfall test that every involved callbacks return their
		 * first param so its value will preserved to the outcome
		 */
		it('should run waterfall logic', function() {
			expect(
				PluginManager.waterfall('waterfall01', 5)
			).to.equal(7);
		});

		it('should be stoppable', function() {
			expect(
				PluginManager.waterfall('stoppableWaterfall', 0)
			).to.equal(1);
		});

		it('should run with empty hook', function() {
			expect(
				PluginManager.waterfall('emptyHook', 10)
			).to.equal(10);
		});

	});

});


