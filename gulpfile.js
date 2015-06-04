var gulp    = require('gulp');
var mocha   = require('gulp-mocha');
var jshint  = require('gulp-jshint');
var stylish = require('jshint-stylish');

gulp.task('lint', function () {
  'use strict';
  return gulp.src('./scripts/**/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter(stylish));
});

gulp.task('test', ['lint'], function () {
  'use strict';
  return gulp.src('./tests/index.js')
    .pipe(mocha({bail: true}));
});
