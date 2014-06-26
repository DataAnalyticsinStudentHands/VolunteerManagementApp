// Generated on 2014-06-13 using generator-angular-cordova 0.0.1
'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'

module.exports = function (grunt) {

    var cordova = require('cordova');
    var device = {
        platform: grunt.option('platform') || 'all',
        family: grunt.option('family') || 'default',
        target: grunt.option('target') || 'emulator'
    };

    // Load grunt tasks automatically
    require('load-grunt-tasks')(grunt);

    // Time how long tasks take. Can help when optimizing build times
    require('time-grunt')(grunt);

    // Define the configuration for all the tasks
    grunt.initConfig({

        // Project settings
        yeoman: {
            // configurable paths
            app: require('./bower.json').appPath || 'app',
            dist: 'dist'
        },

        watchfiles: {
            all: [
                'www/{,*/}*.html',
                'www/js/{,*/,*/}*.js',
                'www/css/{,*/}*.css',
                'www/img/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
            ]
        },

        // Watches files for changes and runs tasks based on the changed files
        watch: {
            js: {
                files: ['<%= yeoman.app %>/js/{,*/}*.js'],
                tasks: ['newer:jshint:all'],
                options: {
                    livereload: true
                }
            },
            jsTest: {
                files: ['test/spec/{,*/}*.js'],
                tasks: ['newer:jshint:test', 'karma']
            },
            css: {
                files: ['<%= yeoman.app %>/css/{,*/}*.css'],
                tasks: ['newer:copy:css', 'autoprefixer']
            },
            gruntfile: {
                files: ['Gruntfile.js']
            },
            livereload: {
                options: {
                    livereload: '<%= connect.options.livereload %>'
                },
                files: [
                    '<%= yeoman.app %>/{,*/}*.html',
                    '.tmp/css/{,*/}*.css',
                    '<%= yeoman.app %>/img/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
                ],
                tasks: ['cordova-prepare', 'cordova-build', 'cordova-emulate']
            }
        },

        // The actual grunt server settings
        connect: {
            options: {
                port: 9000,
                // Change this to '0.0.0.0' to access the server from outside.
                hostname: '0.0.0.0',
                livereload: 35729
            },
            livereload: {
                options: {
                    open: true,
                    base: [
                        '.tmp',
                        '<%= yeoman.app %>'
                    ]
                }
            },
            test: {
                options: {
                    port: 9001,
                    base: [
                        '.tmp',
                        'test',
                        '<%= yeoman.app %>'
                    ]
                }
            },
            dist: {
                options: {
                    base: '<%= yeoman.dist %>'
                }
            }
        },

        // Make sure code styles are up to par and there are no obvious mistakes
        jshint: {
            options: {
                jshintrc: '.jshintrc',
                reporter: require('jshint-stylish')
            },
            all: [
                'Gruntfile.js',
                '<%= yeoman.app %>/js/{,*/}*.js'
            ],
            test: {
                options: {
                    jshintrc: 'test/.jshintrc'
                },
                src: ['test/spec/{,*/}*.js']
            }
        },

        // Empties folders to start fresh
        clean: {
            dist: {
                files: [{
                    dot: true,
                    src: [
                        '.tmp',
                        '<%= yeoman.dist %>/*',
                        '!<%= yeoman.dist %>/.git*'
                    ]
                }]
            },
            server: '.tmp'
        },

        // Add vendor prefixed styles
        autoprefixer: {
            options: {
                browsers: ['last 1 version']
            },
            dist: {
                files: [{
                    expand: true,
                    cwd: '.tmp/css/',
                    src: '{,*/}*.css',
                    dest: '.tmp/css/'
                }]
            }
        },

        // Automatically inject Bower components into the app
        'bower-install': {
            app: {
                html: '<%= yeoman.app %>/index.html',
                ignorePath: '<%= yeoman.app %>/'
            }
        },

        

        // Renames files for browser caching purposes
        rev: {
            dist: {
                files: {
                src: [
                    '<%= yeoman.dist %>/js/{,*/}*.js',
                    '<%= yeoman.dist %>/css/{,*/}*.css',
                    '<%= yeoman.dist %>/img/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
                    '<%= yeoman.dist %>/css/fonts/*'
                 ]
                 }
             }
         },

        // Reads HTML for usemin blocks to enable smart builds that automatically
        // concat, minify and revision files. Creates configurations in memory so
        // additional tasks can operate on them
        useminPrepare: {
            html: '<%= yeoman.app %>/index.html',
            options: {
                dest: '<%= yeoman.dist %>',
                flow: {
                    html: {
                        steps: {
                            js: ['concat', 'uglifyjs'],
                            css: ['cssmin']
                        },
                        post: {}
                    }
                }
            }
        },

        // Copies remaining files to places other tasks can use
        copy: {
            dist: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '<%= yeoman.app %>',
                    dest: '<%= yeoman.dist %>',
                    src: [
                        '*.{ico,png,txt}',
                        '.htaccess',
                        '*.html',
                        'tpl/{,*/}*.html',
                        'vendor/**/*',
                        'img/{,*/}*.{webp}',
                        'fonts/*'
                    ]
                }, {
                    expand: true,
                    cwd: '.tmp/images',
                    dest: '<%= yeoman.dist %>/img',
                    src: ['generated/*']
                }]
            },
            css: {
                expand: true,
                cwd: '<%= yeoman.app %>/css',
                dest: '.tmp/css/',
                src: '{,*/}*.css'
            }
        },

        // Performs rewrites based on rev and the useminPrepare configuration
        usemin: {
            html: ['<%= yeoman.dist %>/{,*/}*.html'],
            css: ['<%= yeoman.dist %>/css/{,*/}*.css'],
            options: {
                assetsDirs: ['<%= yeoman.dist %>']
            }
        },

        // The following *-min tasks produce minified files in the dist folder
        cssmin: {
            options: {
                root: '<%= yeoman.app %>'
            }
        },

        imagemin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= yeoman.app %>/img',
                    src: '{,*/}*.{png,jpg,jpeg,gif}',
                    dest: '<%= yeoman.dist %>/img'
                }]
            }
        },

        // ngmin tries to make the code safe for minification automatically by
        // using the Angular long form for dependency injection. It doesn't work on
        // things like resolve or inject so those have to be done manually.
        ngmin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '.tmp/concat/js',
                    src: '*.js',
                    dest: '.tmp/concat/js'
                }]
            }
        },

        // Run some tasks in parallel to speed up the build process
        concurrent: {
            server: [
                'copy:css'
            ],
            test: [
                'copy:css'
            ],
            dist: [
                'copy:css',
                'imagemin'
            ]
        },

        // Test settings
        karma: {
            unit: {
                configFile: 'karma.conf.js',
                singleRun: true
            }
        },

        shell: {
            iossimstart: {
                command: 'ios-sim launch platforms/ios/build/volunteerManagementApp.app --exit' + (device.family !== 'default' ? ' --family ' + device.family : ''),
                options: {
                    stdout: true
                }
            },
            iossimend: {
                command: 'killall -9 "iPhone Simulator"'
            }
        }

    });

    // Cordova Tasks
    grunt.registerTask('cordova-prepare', 'Cordova prepare tasks', function () {
        var done = this.async();

        if (device.platform === 'all') {
            // Prepare all platforms
            cordova.prepare(done);
        } else {
            cordova.prepare(device.platform, done);
        }
    });

    grunt.registerTask('cordova-build', 'Cordova building tasks', function () {
        var done = this.async();

        if (device.platform === 'all') {
            // Build all platforms
            cordova.build(done);
        } else {
            cordova.build(device.platform, done);
        }
    });

    grunt.registerTask('cordova-run', 'Cordova running tasks', function () {
        var done = this.async();

        if (device.platform === 'all') {
            // Build all platforms
            cordova.run(done);
        } else {
            cordova.run(device.platform);
        }
    });

    grunt.registerTask('cordova-emulate', 'Cordova emulation tasks', function () {
        var done = this.async();

        if (device.platform === 'all') {
            // Emulate all platforms
            cordova.emulate();
        } else {
            if (device.platform === 'ios') {
                grunt.task.run('shell:iossimstart');
            } else {
                cordova.emulate(device.platform, function() {
                    grunt.task.run('cordova-emulate-end');
                });
            }
        }

        done();
    });

    grunt.registerTask('cordova-emulate-end', 'Cordova emulation tasks', function () {
        if (device.platform === 'all' || device.platform === 'ios') {
            grunt.task.run('shell:iossimend');
        }
    });

    grunt.registerTask('cordova-buildemulate', [
        'cordova-build',
        'cordova-emulate'
    ]);

    grunt.registerTask('cordova-buildrun', [
        'cordova-build',
        'cordova-run'
    ]);

    grunt.registerTask('emulate', ['cordova-buildemulate']);

    grunt.registerTask('device', ['cordova-buildrun']);

    grunt.registerTask('serve', function (target) {
        if (target === 'dist') {
            return grunt.task.run(['build', 'connect:dist:keepalive']);
        }

        grunt.task.run([
            'clean:server',
            'bower-install',
            'concurrent:server',
            'autoprefixer',
            'connect:livereload',
            'cordova-prepare',
            'watch'
        ]);
    });

    grunt.registerTask('test', [
        'clean:server',
        'concurrent:test',
        'autoprefixer',
        'connect:test',
        'karma'
    ]);

    grunt.registerTask('build', [
        'clean:dist',
        'bower-install',
        'useminPrepare',
        'concurrent:dist',
        'autoprefixer',
        'concat',
        'ngmin',
        'copy:dist',
        'cdnify',
        'cssmin',
        'uglify',
        'rev',
        'usemin'
    ]);

    grunt.registerTask('default', [
        'newer:jshint',
        'test',
        'build'
    ]);
};
