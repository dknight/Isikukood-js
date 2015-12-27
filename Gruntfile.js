module.exports = function (grunt) {
  
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  
  grunt.initConfig({
    uglify: {
      target1: {
        src: 'isikukood.js',
        dest: 'isikukood.min.js'
      }
    },
    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        unused: true
      },
      target1: ['Gruntfile.js', 'isikukood.js']
    }
  });
  grunt.registerTask('default', ['jshint', 'uglify']);
  
};