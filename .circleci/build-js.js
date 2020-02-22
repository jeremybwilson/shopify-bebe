'use strict';

// TO DISABLE MINIFICATION:
//  -> Change 'minifyBuild' below to false
var minifyBuild = true;

var gulp = require('gulp');
var browserify = require('gulp-browserify');
var babel = require('gulp-babel');
var uglify = require('gulp-uglify');
var include = require('gulp-include');
var plumber = require('gulp-plumber');
var chokidar = require('chokidar');

var config = require('./includes/config.js');
var messages = require('./includes/messages.js');
var utils = require('./includes/utilities.js');

function processThemeJs() {
  messages.logProcessFiles('build:js');
  return gulp.src([config.roots.js, '!' + config.roots.vendorJs])
  .pipe(plumber(utils.errorHandler))
  .pipe(babel({presets:['env','react'], "compact": minifyBuild}))
  .pipe(include())
  .pipe(browserify({transform: ['reactify']}))
  .pipe(babel({presets:['env','react'], "compact": minifyBuild})) //Compiles the js from imported react components
  .pipe(gulp.dest(config.dist.assets));
}

function processVendorJs() {
  messages.logProcessFiles('build:vendor-js');
  return gulp.src(config.roots.vendorJs)
    .pipe(plumber(utils.errorHandler))
    .pipe(include())
    .pipe(uglify({
      mangle: minifyBuild,
      compress: minifyBuild,
      preserveComments: 'license'
    }))
    .pipe(gulp.dest(config.dist.assets));
}

gulp.task('build:js', function () {
  processThemeJs();
});

gulp.task('watch:js', function () {
  chokidar.watch([config.src.js, '!' + config.roots.vendorJs, '!' + config.src.vendorJs], { ignoreInitial: true }).on('all', function (event, path) {
    messages.logFileEvent(event, path);
    processThemeJs();
  });
});

gulp.task('build:vendor-js', function () {
  processVendorJs();
});

gulp.task('watch:vendor-js', function () {
  chokidar.watch([config.roots.vendorJs, config.src.vendorJs], { ignoreInitial: true }).on('all', function (event, path) {
    messages.logFileEvent(event, path);
    processVendorJs();
  });
});
