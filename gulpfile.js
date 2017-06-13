var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();
var del = require('del');
var runSequence = require('run-sequence');
var browserify = require('browserify');
var watchify = require('watchify');
var source = require('vinyl-source-stream');
var tsify = require('tsify');
var buffer = require('vinyl-buffer');
var uglify = require('gulp-uglify');
//var sourcemaps = require('gulp-sourcemaps');

gulp.task('sass', function() {
    return gulp.src("scss/index.scss")
        .pipe(sass())
        .pipe(gulp.dest('dist'))
        .pipe(browserSync.reload({ stream: true }))
})

gulp.task('browserSync', function() {
    browserSync.init({
        server: {
            baseDir: "."
        },
        open: false
    })  
})

gulp.task('clean:dist', function() {
    return del.sync('dist');
})

gulp.task('typescript', function() {
		//process.env.NODE_ENV = 'production';
		return browserify({
				entries: ['ts/bootstrap.tsx'],
				debug: false,
				extensions: ['tsx'],
				plugin: [
					[tsify, {project: 'ts/tsconfig.json'}]
				],
		})
		.bundle()
		.on('error', function(err) {
			console.log(err.message);
			this.emit('end');
		})
		.pipe(source('bundle.js'))
		.pipe(buffer())
		.pipe(gulp.dest('dist'));
})

gulp.task('watch', ['browserSync', 'sass', 'typescript'], function() {
    gulp.watch('scss/**/*.scss', ['sass']);
    gulp.watch('ts/**/*.ts', ['typescript']);
    gulp.watch('ts/**/*.tsx', ['typescript']);
    gulp.watch('app/*.html', browserSync.reload);
    //gulp.watch('js/**/*.js', browserSync.reload);
})

gulp.task('build', function(callback) {
    runSequence(
        'clean:dist', 
        'typescript',
        'sass',
        callback)
})

gulp.task('default', ['build', 'watch']);
