var gulp 				= require('gulp'),
		prettify 		= require('gulp-jsbeautifier'),
		runSequence = require('run-sequence');

gulp.task('verify-js', function() {
	gulp.src('assets/js/*.js')
		.pipe(prettify({
			config: '.jsbeautifyrc',
			mode: 'VERIFY_ONLY'
		}));
});

gulp.task('prettify-js', function() {
	gulp.src('assets/js/*.js')
		.pipe(prettify({
			config: '.jsbeautifyrc',
			mode: 'VERIFY_AND_WRITE'
		}))
		.pipe(gulp.dest('assets/js/'));
});

gulp.task('prettify-html', function() {
	gulp.src(['assets/**/*.html'])
		.pipe(prettify({
			braceStyle: "collapse",
			indentChar: " ",
			indentSize: 2
		}))
		.pipe(gulp.dest('assets/'));
});

gulp.task('prettify-code', function() {
	runSequence(
		['prettify-js', 'prettify-html']
	);
});
