'use strict';

var gulp = require('gulp');
var minifyJS = require('gulp-uglify');
var rename = require('gulp-rename');
var pump = require('pump');
var babel = require('gulp-babel');
var concat = require('gulp-concat');
var minifyCss = require('gulp-csso');
var stripCssComments = require('gulp-strip-css-comments');

gulp.task('compress', () => {
	return gulp.src('./src/js/*.js')
		.pipe(babel())
		.pipe(minifyJS())
		.pipe(rename({
			suffix: '.min'
		}))
		.pipe(gulp.dest('./src/assets'));

});
gulp.task('concat', () => {
	return gulp.src([
		'./src/css/*.css',
		'.!/src/css/core.min.css',
		'!./src/css/main.css',
		'.!/src/css/main.min.css'
	])
		.pipe(concat('core.css'))
		.pipe(minifyCss())
		.pipe(rename({
			suffix: '.min'
		}))
		.pipe(stripCssComments())
		.pipe(gulp.dest('./src/css'));

});
gulp.task('concatmain', () => {
	return gulp.src([
		'./src/css/main.css',
		'.!/src/css/main.min.css'
	])
		.pipe(minifyCss())
		.pipe(rename({
			suffix: '.min'
		}))
		.pipe(gulp.dest('./src/css'));

});
gulp.task('concatjs', () => {
	return gulp.src([
		'./src/vendor/lodash.min.js',
		'./src/vendor/jquery.min.js',
		'./src/vendor/jquery-ui.min.js',
		'./src/vendor/js.cookie.min.js',
		'./src/vendor/popper.min.js',
		'./src/vendor/bootstrap.min.js',
		'./src/vendor/validator.min.js',
		'./src/vendor/moment.min.js',
		'./src/vendor/jquery.contextMenu.min.js',
		'./src/vendor/jquery-ui-timepicker-addon.min.js',
		'./src/vendor/select2.min.js',
		'./src/vendor/bootstrap-colorpicker.min.js',
		'./src/vendor/md5.min.js',
		'./src/vendor/toastr.min.js',
		'./src/vendor/typeahead.bundle.min.js',
		'!./src/vendor/core.min.js'
	])
		.pipe(concat('core.js'))
		.pipe(rename({
			suffix: '.min'
		}))
		.pipe(gulp.dest('./src/vendor'));

});
gulp.task('default', ['compress', 'concatmain', 'concat', 'concatjs']);
