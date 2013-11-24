/**
 * Test Plugin01
 *
 *
 * LOADING ORDER:
 * even if it's folder name is first in alphabetical order this
 * package will execute after "plugin02"!
 *
 */
module.exports = function(context) {
	return {

		priority: 20,

		// synchronous initialization
		init: function() {
			context.init1 = 'Fake Plugin01';
		},



// ----------------------------------------------- //
// ---[[   S T A N D A R D   R U N N I N G   ]]--- //
// ----------------------------------------------- //

		run01: function(list) {
			list.push('plugin01');
		},

		// asyncronous hook doing syncronous staff
		// does not need to use any callbacl
		parallel01: function() {
			return;
		},


		// should run waterfall logic
		waterfall01: function(add) {
			return add + 1;
		},

// --------------------------------------------------- //
// ---[[   S T O P P A B L E   B E H A V I O R   ]]--- //
// --------------------------------------------------- //

		stoppableRun: function(list) {
			list.push('plugin01');
			this.stop();
		},

		stoppableParallel: function(list) {
			var done = this.async();
			setTimeout(function() {
				list.push('plugin01');
				done(true);
			}, 0);
		},

		stoppableWaterfall: function(num) {
			return num + 1;
		}


	};
};