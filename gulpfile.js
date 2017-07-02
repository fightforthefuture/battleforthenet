var spawn = require('child_process').spawn;

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
var jimp = require('gulp-jimp');
//var sourcemaps = require('gulp-sourcemaps');

var prodBuild = (process.env.NODE_ENV === "production");

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
    var ret = browserify({
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
    .pipe(buffer());

    if (prodBuild) {
      ret = ret.pipe(uglify())
    }

    return ret.pipe(gulp.dest('dist'));
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

gulp.task('download-congress.jpg', function(cb) {
    var dir = './tmp/congress';
    var cmd = spawn('svn', ['export', '--force', 'https://github.com/unitedstates/images/trunk/congress/450x550', dir], {stdio: 'inherit'});
    return cmd.on('close', cb);
})

gulp.task('congress.jpg', ['download-congress.jpg'], function() {
    return gulp.src('tmp/congress/*.jpg').pipe(jimp({
        '_x1': {
            cover: {
                width: 100,
                height: 122
            },
            greyscale: true
        },
        '_x2': {
            cover: {
                width: 200,
                height: 244
            },
            greyscale: true
        }
    }, true)).pipe(gulp.dest('./images/scoreboard/'));
})

gulp.task('default', ['build', 'watch']);
