/**
 * Test Plugin02
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

		// should run waterfall logic
		foo1: function(add) {
			return add;
		},

		// async hook running asynchronous callback logic
		async1: function() {
			var done = this.async();
			setTimeout(function() {
				done();
			}, 0);
		},

		series1: function() {
			var done = this.async();
			setTimeout(function() {
				context.list.push('plugin02');
				done();
			}, 0);
		}
	};
};