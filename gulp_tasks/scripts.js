const gulp = require('gulp');
const eslint = require('gulp-eslint');
const plumber = require('gulp-plumber')
const concat = require('gulp-concat')
//const babel = require('gulp-babel')

const conf = require('../conf/gulp.conf');
gulp.task('scripts', scripts);

function scripts() {
  return gulp.src(conf.path.src('/app/*.js'))
    .pipe(plumber())
    .pipe(concat('main.js'))
    //.pipe(babel())
    .pipe(gulp.dest('.tmp/scripts'))
}
