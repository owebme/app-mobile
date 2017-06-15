var gulp = require('gulp');
var sass = require('gulp-sass');
var csso = require('gulp-csso');
var base64 = require('gulp-base64');
var autoprefixer = require('gulp-autoprefixer');
var notify = require('gulp-notify');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var babel = require('gulp-babel');
var uncss = require('gulp-uncss');
var combiner = require('stream-combiner2').obj;
var browserSync = require('browser-sync').create();
var reload = browserSync.reload;

gulp.task('styleguide', function() {
	return combiner(
		gulp.src('assets/css/styleguide.scss'),
		sass(),
		csso(),
		autoprefixer({
			browsers: ['last 2 versions'],
			cascade: false
		}),
        base64({
            baseDir: './',
            extensions: ['svg', 'png', 'jpg'],
            maxImageSize: 16*1024, // bytes
            debug: false
        }),
		gulp.dest('assets/css'),
		browserSync.stream()
	).on('error', notify.onError({
		"sound": false,
	}));
});

gulp.task('uncss', function () {
	return combiner(
    	gulp.src('assets/css/styleguide.css'),
        uncss({
            html: ['assets/templates/modules/alert.html']
        }),
		csso(),
		autoprefixer({
			browsers: ['last 2 versions'],
			cascade: false
		}),
        base64({
            baseDir: './',
            extensions: ['svg', 'png', 'jpg'],
            maxImageSize: 16*1024, // bytes
            debug: false
        }),
		rename('alert.min.css'),
        gulp.dest('assets/css')
	).on('error', notify.onError({
		"sound": false,
	}));
});

gulp.task('babel', function() {
	return combiner(
		gulp.src('assets/js/components/commons/ionic/animation.js'),
		babel({
            presets: ['es2015']
        }),
		gulp.dest('assets/js/components/commons/ionic/dist')
	).on('error', notify.onError({
		"sound": false,
	}));
});

gulp.task('serve', function() {
	browserSync.init({
		open: false,
		notify: false,
		watchOptions: {
	        usePolling: true
	    },
		//proxy: "http://localhost:8110/"
		server: {
			baseDir: "./"
		}
	});
});

gulp.task('watch', function() {
	browserSync.watch([
		'assets/js/*.js',
		'assets/js/**/*.js',
		'assets/templates/*.html',
		'assets/templates/**/*.html',
		'index.html'
	]).on('change', reload);

	gulp.watch([
		'assets/css/styleguide.scss',
		'assets/css/**/*.scss'
	], gulp.parallel('styleguide'));
});

gulp.task('dev', gulp.series(
	gulp.parallel('styleguide'),
	gulp.parallel('serve', 'watch')
));
