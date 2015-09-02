'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),    
    browserify: {
        dist: {
            files: {
                'dist/bundle.js': ['flownetwork.js']
            }
        }
    },
    jshint: {
        options: {
            jshintrc: '.jshintrc'
        },
        all: ['*.js']
    }
  });

  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-jshint');

  // Default task(s).
  grunt.registerTask('default', ['jshint','browserify']);
};