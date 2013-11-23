/**
 * Test Plugin01
 *
 */
module.exports = function(context) {
	return {

		priority: 20,

		// synchronous initialization
		init: function() {
			context.init1 = 'Fake Plugin01';
		},

		// should run waterfall logic
		foo1: function(add) {
			return add;
		},

		// asyncronous hook doing syncronous staff
		// does not need to use any callbacl
		async1: function() {
			return;
		},


		series1: function() {
			context.list.push('plugin01');
		}


	};
};