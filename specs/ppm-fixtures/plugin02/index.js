/**
 * Test Plugin02
 *
 *
 * LOADING ORDER:
 * even if this plugin folder's name alphabetical order is afet
 * "plugin01" this package will execute first because of exposed priority
 *
 */
module.exports = function(context) {
	return {

		priority: 10,

		// asynchronous initialization
		init: function() {
			var done = this.async();
			setTimeout(function() {
				context.init2 = 'Fake Plugin01';
				done();
			}, 0);
		},



// ----------------------------------------------- //
// ---[[   S T A N D A R D   R U N N I N G   ]]--- //
// ----------------------------------------------- //

		run01: function(list) {
			var done = this.async();
			setTimeout(function() {
				list.push('plugin02');
				done();
			}, 0);
		},

		// async hook running asynchronous callback logic
		parallel01: function() {
			var done = this.async();
			setTimeout(function() {
				done();
			}, 0);
		},

		// should run waterfall logic
		waterfall01: function(add) {
			return add + 1;
		},



// --------------------------------------------------- //
// ---[[   S T O P P A B L E   B E H A V I O R   ]]--- //
// --------------------------------------------------- //

		stoppableRun: function(list) {
			var done = this.async();
			setTimeout(function() {
				list.push('plugin02');
				done(true);
			}, 0);
		},

		stoppableParallel: function(list) {
			var done = this.async();
			setTimeout(function() {
				list.push('plugin02');
				done(true);
			}, 0);
		},

		stoppableWaterfall: function(num) {
			this.stop();
			return num + 1;
		}

	};
};