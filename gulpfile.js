(function(){
    'use strict';    
    var gulp = require('gulp'),
        sass = require('gulp-sass'),
        jade = require('gulp-jade'),
        uglify = require('gulp-uglify'),
        browsersync = require('browser-sync'),
        dest = require('gulp-dest'),
        reload = browsersync.reload,
        sourcemaps = require('gulp-sourcemaps'),
        paths = {
            root: './',
            build: {
                root: './build/',
                images: './build/img',
                styles: './build/css',
                scripts: './build/js',
            },
            source: {
                root: './src/',
                styles: './src/css/',
                scripts: './src/js/*.js',
                templates: './src/*.jade',
                images: './src/img/*'
            }
          };
          
    gulp.task('browsersync', function() {
        browsersync({
            files: [paths.build.root],
            server: {
                baseDir: "./"
            },
            open: false,
            host: "127.0.0.1"
            });
    });
        
    gulp.task('sass', function () {
     return gulp.src(paths.source.root + '/css/*.scss')
      .pipe(sourcemaps.init())
      .pipe(sass().on('error', sass.logError))
      .pipe(gulp.dest(paths.build.styles))
      .pipe(reload({stream:true}));
    });
    
    gulp.task('templates', function() {
      gulp.src(paths.source.templates)
        .pipe(jade({
          pretty: true
        }))
        .pipe(gulp.dest(paths.build.root))
        .pipe(reload({stream:true}));
    });
    
    gulp.task('images', function () {
        gulp.src(paths.source.images)
            .pipe(gulp.dest(paths.build.images));
    });
    
    gulp.task('manifest', function () {
        gulp.src(paths.source.root + 'manifest.json')
            .pipe(gulp.dest(paths.build.root));
    });
    
    gulp.task('css', function () {
        gulp.src('./src/css/*.css')
            .pipe(gulp.dest(paths.build.styles));
    });
    
    gulp.task('font', function () {
        gulp.src('./src/font/*')
            .pipe(gulp.dest(paths.build.root + 'font'));
    });
    
    gulp.task('scripts', function () {
        return gulp.src(paths.source.scripts)
            // .pipe(uglify())
            .pipe(gulp.dest(paths.build.scripts))
            .pipe(reload({stream:true}));
    });
    
    gulp.task('build', ['sass', 'templates', 'images', 'scripts', 'manifest', 'css', 'font']);
    
    gulp.task('server', [ 'browsersync', 'build', 'watch']);

    gulp.task('default', [ 'server' ]);
    
    gulp.task('watch', function () {
        gulp.watch(paths.source.scripts, [ 'scripts' ]);
        gulp.watch(paths.source.styles + '*.scss', [ 'sass' ]);
        gulp.watch(paths.source.templates, [ 'templates' ]);
    });
})();        