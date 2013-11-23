/**
 * Polite Plugin Manager
 * run tests
 */

'use strict';

module.exports = function(grunt) {

	grunt.initConfig({

		pkg: grunt.file.readJSON("package.json"),

		// test runner suite
		'mocha-chai-sinon': {
			options: {
				ui: 'bdd'
			},
			build: {
				src: ['./specs/**/*.spec.js'],
				options: {
					reporter: 'spec',
					require: 'coverage/blanket'
				}
			},
			coverage: {
				src: ['./specs/**/*.spec.js'],
				options: {
					reporter: 'html-cov',
					quiet: true,
					captureFile: './build/specs-coverage.html'
				}
			}
		},

		clean: {
			build: ['./build']
		},

		watch: {
			build: {
				files: [
					'./index.js',
					'./libs/**/*.js',
					'./specs/**/*.js'
				],
				tasks: [
					'default'
				]
			}
		},

		open: {
			coverage: {
				path: "<%= grunt.config.data['mocha-chai-sinon'].coverage.options.captureFile %>"
			}
		}

	});


	/**
	 * Load Dependencies
	 */
	
	grunt.loadNpmTasks("grunt-mocha-chai-sinon");
	grunt.loadNpmTasks("grunt-contrib-clean");
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-open');


	/**
	 * Register Tasks
	 */

	grunt.registerTask('default', [
		'clean:build',
		'mocha-chai-sinon:build'
	]);

	grunt.registerTask('start', [
		'default',
		'watch:build'
	]);

	grunt.registerTask('specs', [
		'mocha-chai-sinon',
		'open:coverage'
	]);

};