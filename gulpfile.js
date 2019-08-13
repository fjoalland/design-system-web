// Requires
var gulp = require('gulp');
var postcss = require('gulp-postcss');
var sass = require('gulp-sass');
var rename = require('gulp-rename');
var concat = require('gulp-concat');
var run = require('gulp-run');
var gutil = require('gulp-util');
var browserSync = require('browser-sync').create();
var cssnano = require('cssnano'); // minifies CSS
var autoprefixer = require('autoprefixer');
var unprefix = require("postcss-unprefix"); // deletes old prefixes using browsersList variable
var flexbugs = require('postcss-flexbugs-fixes'); // flexbox fixes for IE
var gaps = require('postcss-gap-properties'); // gaps polyfill

var jekyllDir = "docs/",
    cssDest = 'framework/css/',
    jsFiles = ['framework/js/**/*.js', '!framework/js/*.js'],
    jsDest  = 'framework/js';

var postCssPlugins = [
  unprefix(),
  autoprefixer({
    grid: true
  }),
  flexbugs(),
  gaps()
];

var postCssPluginsProd =  [
  unprefix(),
  autoprefixer({
    grid: true
  }),
  flexbugs(),
  gaps(),
  cssnano()
];

gulp.task('build:css:cd44:dev', function () {
  return gulp.src('framework/scss/cd44.scss')
    .pipe(sass({
      outputStyle: 'expanded' // CSS non minifiée plus lisible ('}' à la ligne)
    }))
    .pipe(postcss(postCssPlugins))
    .pipe(rename('cd44.css'))
    .pipe(browserSync.stream())
    .pipe(gulp.dest(cssDest));
});

gulp.task('build:css:ResetAndGrid', function () {
  return gulp.src('framework/scss/reset_grid.scss')
    .pipe(sass())
    .pipe(postcss(postCssPluginsProd))
    .pipe(rename('reset_grid.min.css'))
    .pipe(gulp.dest(cssDest));
});

gulp.task('build:css:cd44:prod', function () {
  return gulp.src('framework/scss/cd44.scss')
    .pipe(sass())
    .pipe(postcss(postCssPluginsProd))
    .pipe(rename('cd44.min.css'))
    .pipe(gulp.dest(cssDest));
});

gulp.task('build:js', function() {
  return gulp.src(jsFiles)
      .pipe(concat('cd44.js'))
      .pipe(gulp.dest(jsDest));
});

gulp.task('build:jekyll', function() {
  return gulp.src(jekyllDir)
    .pipe(run('cd docs && bundle exec jekyll build'))
    .on('error', gutil.log);
});

gulp.task('build', gulp.parallel('build:css:cd44:dev', 'build:css:cd44:prod', 'build:js', 'build:jekyll'));

gulp.task('serve', gulp.series('build', function() {
  
  browserSync.init({
    server: {
      baseDir : 'docs/_site',
      middleware: function(req,res,next) {
        // When publihed on github pages, base path starts with 'design-system-web'
        if (req.url.startsWith('/design-system-web')) {
          req.url = req.url.substr(18);
        } 
        return next();
      },
      // Load design system from the framework directory
      routes: {
        "/build": "framework"
      }
    },
    ghostMode: false, // do not mirror clicks, reloads, etc. (performance optimization)
    logFileChanges: true,
    open: false       // do not open the browser (annoying)
  });

  gulp.watch('docs/**/*.(md|yml|js|scss)', gulp.series('build:jekyll', function() {
    browserSync.reload(); 
  }));

   gulp.watch('docs/_variation/**/*.html', gulp.series('build:jekyll', function() {
    browserSync.reload();
  }));

  // Watch framework .scss files
  gulp.watch(['framework/scss/**/*.scss'], gulp.series('build:css:cd44:dev'));

  // Watch framework .js files
  gulp.watch('framework/js/**/*.js', gulp.series('build:js', function() {
    browserSync.reload(); 
  }));

}));

gulp.task('default', gulp.series('build'));