module.exports = function(grunt) {
    'use strict';
    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            options: {
                stripBanners: true,
                banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
                        '<%= grunt.template.today("yyyy-mm-dd") %> */' +
                        '\n',
            },
            pub: {
                src: [
                    './wp-content/themes/<%= pkg.theme %>/js/jquery.*.js',
                    './wp-content/themes/<%= pkg.theme %>/js/lazyload.js',
                    './wp-content/themes/<%= pkg.theme %>/js/fitvids.js',
                    './wp-content/themes/<%= pkg.theme %>/js/aos.js',
                    './wp-content/themes/<%= pkg.theme %>/js/svgxuse.js',
                    './wp-content/themes/<%= pkg.theme %>/js/captcha.js',
                    './wp-content/themes/<%= pkg.theme %>/js/js.cookie.js',
                    './wp-content/themes/<%= pkg.theme %>/js/in-view.min.js',
                    './wp-content/themes/<%= pkg.theme %>/js/<%= pkg.name %>.js',
                    './wp-content/themes/<%= pkg.theme %>/js/<%= pkg.name %>.*.js',
                    '!./wp-content/themes/<%= pkg.theme %>/js/jquery.js',
                    '!./wp-content/themes/<%= pkg.theme %>/js/jquery.min.js',
                    '!./wp-content/themes/<%= pkg.theme %>/js/bazaar-voice-*.js',
                    '!./wp-content/themes/<%= pkg.theme %>/js/<%= pkg.name %>.min.js'
                ],
                dest: './wp-content/themes/<%= pkg.theme %>/js/<%= pkg.name %>.min.js'
            }
        },
        jshint: {
            files: ['*.js'],
            beforeconcat: ['.js'],
            afterconcat: ['<%= pkg.name %>.js'],
            options: {
                ignores: ['jquery.*']
            }
        },
        uglify: {
            options: {
                stripBanners: true
            },
            pub: {
                files: {
                    './wp-content/themes/<%= pkg.theme %>/js/<%= pkg.name %>.min.js': [
                        './wp-content/themes/<%= pkg.theme %>/js/<%= pkg.name %>.min.js'
                    ]
                }
            }
        },
        cssmin: {
            options: {
                report: 'min',
                root: './',
                rebaseTo: './wp-content/themes/<%= pkg.theme %>/',
                target: './wp-content/themes/<%= pkg.theme %>/',
                relativeTo: './wp-content/themes/<%= pkg.theme %>/css/',
                rebase: true,
                keepSpecialComments: 0
            },
            target: {
                files: {
                    './wp-content/themes/<%= pkg.theme %>/css/<%= pkg.name %>.min.css':
                    [
                        './wp-content/themes/<%= pkg.theme %>/style.css',
                        './wp-content/themes/<%= pkg.theme %>/css/aos.css'
                    ]
                }
            }
        },
        copy:{
            main:{
                files: [
                    { expand: true, flatten: true, src:
                        [
                            'node_modules/fitvids/fitvids.js',
                            'node_modules/js-cookie/src/js.cookie.js',
                            'node_modules/jquery-modal/jquery.modal.js',
                            'node_modules/svgxuse/svgxuse.js',
                            'node_modules/vanilla-lazyload/dist/lazyload.js'
                        ],
                   dest: 'wp-content/themes/<%= pkg.theme %>/js/', filter: 'isFile'},
               ]
            }
        },
    });

    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-banner');

    // test task(s)
    grunt.registerTask('test', ['jshint', 'concat']);
    // Default task(s).
    grunt.registerTask('default', ['concat', 'uglify', 'cssmin', 'copy']);
};
