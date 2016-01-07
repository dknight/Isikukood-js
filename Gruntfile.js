module.exports = function (grunt) {
  
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      target1: {
        src: 'isikukood.js',
        dest: 'isikukood.min.js',
        options: {
          banner: '/*\n<%= pkg.name %> - v<%= pkg.version %>\n<%= pkg.homepage %>\n*/\n'
        }
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