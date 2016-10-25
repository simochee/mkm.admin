"use strict"

const gulp = require('gulp');
const webpack = require('gulp-webpack');
const sass = require('gulp-sass');
const plumber = require('gulp-plumber');
const pug = require('gulp-pug');
const postcss = require('gulp-postcss');
const cssnext = require('postcss-cssnext');

gulp.task('webpack', () => {
	gulp.src('./src/scripts/entry.js')
		.pipe(webpack(require('./webpack.config.js')))
		.pipe(gulp.dest('./docs/scripts'));
});

gulp.task('sass', () => {
	gulp.src('./src/sass/**/!(_)*.sass')
		.pipe(plumber())
		.pipe(sass({
			preferredSyntax: 'sass',
			outputStyle: 'compressed'
		}).on('error', sass.logError))
		.pipe(postcss([ cssnext() ]))
		.pipe(gulp.dest('./docs/stylesheets'));
});

gulp.task('pug', () => {
	gulp.src('./src/pug/*.jade')
		.pipe(pug())
		.pipe(gulp.dest('./docs'));
});

gulp.task('images', () => {
	gulp.src('./src/img/**/*')
		.pipe(gulp.dest('./docs/images'));
});

gulp.task('watch', () => {
	gulp.watch('./src/pug/**/*.jade', ['pug']);
});

gulp.task('dev', ['watch', 'webpack', 'pug']);