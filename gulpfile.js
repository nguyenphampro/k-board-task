'use strict';

var gulp = require('gulp');
var minifyJS = require('gulp-uglify');
var rename = require('gulp-rename');
var pump = require('pump');
var babel = require('gulp-babel');

gulp.task('compress', () => {
	return gulp.src('./src/js/*.js')
		.pipe(babel())
		.pipe(minifyJS())
		.pipe(rename({
			suffix: '.min'
		}))
		.pipe(gulp.dest('./src/assets'));

});
gulp.task('default', ['compress']);
