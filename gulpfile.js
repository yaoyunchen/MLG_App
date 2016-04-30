var gulp =          require('gulp');
var concat =        require('gulp-concat');
var uglify =        require('gulp-uglify');
var ngAnnotate =    require('gulp-ng-annotate');
var notify =        require('gulp-notify');
var sourcemaps =    require('gulp-sourcemaps');
var plumber =       require('gulp-plumber');

gulp.task('js', function() {
  return gulp.src(['public/javascripts/angularApp.js', 'public/javascripts/controllers/*.js', 'public/javascripts/directives/*.js', 'public/javascripts/factories/*.js'])
  .pipe(concat('public/javascripts/cmlg-app.js'))
  .pipe(ngAnnotate())
  .pipe(uglify())
  .pipe(gulp.dest('.'))
  .pipe(notify({message: 'JS Updated.'}))
});

gulp.task('css', function() {
  return gulp.src(['public/stylesheets/*.css'])
  .pipe(concat('public/cmlg-app.css'))
  .pipe(sourcemaps.init())
  .pipe(plumber())
  .pipe(sourcemaps.write())
  .pipe(gulp.dest('.'))
  .pipe(notify({message: 'CSS Updated.'}))
});

gulp.task('watch', function() {
  gulp.watch(['public/javascripts/angularApp.js', 'public/javascripts/controllers/*.js', 'public/javascripts/directives/*.js', 'public/javascripts/factories/*.js'], gulp.parallel('js'));

  gulp.watch(['public/stylesheets/*.css'], gulp.parallel('css'));
});
