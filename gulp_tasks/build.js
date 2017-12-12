const gulp = require('gulp');
const filter = require('gulp-filter');
const useref = require('gulp-useref');
const lazypipe = require('lazypipe');
const rev = require('gulp-rev');
const revReplace = require('gulp-rev-replace');
const uglify = require('gulp-uglify');
const cssnano = require('gulp-cssnano');
const htmlmin = require('gulp-htmlmin');
const sourcemaps = require('gulp-sourcemaps');
const uglifySaveLicense = require('uglify-save-license');
const inject = require('gulp-inject');
const ngAnnotate = require('gulp-ng-annotate');
const cdnizer = require("gulp-cdnizer")

const conf = require('../conf/gulp.conf');

gulp.task('build', build);

function build() {

  const htmlFilter = filter(conf.path.tmp('*.html'), {
    restore: true
  });
  const jsFilter = filter(conf.path.tmp('**/*.js'), {
    restore: true
  });
  const cssFilter = filter(conf.path.tmp('**/*.css'), {
    restore: true
  });

  return gulp.src(conf.path.tmp('/index.html'))
    .pipe(cdnizer({
      allowRev: false,
      files: ['google:angular',
        'cdnjs:angular-translate',
        'cdnjs:angular-translate-loader-static-files',
        'cdnjs:angular-drag-and-drop-lists',
        'cdnjs:ng-inline-edit',
        'cdnjs:angular-local-storage',
        'cdnjs:angular-cookies',
        'cdnjs:angular-translate-storage-cookie',
        'cdnjs:angular-translate-storage-local',
        'cdnjs:SHA-1',
        'cdnjs:angulartics',
        'cdnjs:angulartics-google-analytics',
        'cdnjs:angular-animate',
        'cdnjs:angular-aria',
        'cdnjs:angular-messages',
        'cdnjs:angular-material',
        'cdnjs:angular-tinycolor',
        'cdnjs:angular-sanitize',
        'cdnjs:md-color-picker'
      ]
    }))
    .pipe(useref({}, lazypipe().pipe(sourcemaps.init, {
      loadMaps: true
    })))
    .pipe(jsFilter)
    .pipe(ngAnnotate())
    .pipe(uglify({
      preserveComments: uglifySaveLicense
    })).on('error', conf.errorHandler('Uglify'))
    .pipe(rev())
    .pipe(jsFilter.restore)
    .pipe(cssFilter)
    .pipe(cssnano())
    //.pipe(rev())
    .pipe(cssFilter.restore)
    .pipe(revReplace())
    .pipe(sourcemaps.write('maps'))
    .pipe(htmlFilter)
    .pipe(htmlmin())
    .pipe(htmlFilter.restore)
    .pipe(gulp.dest(conf.path.dist()));
}
