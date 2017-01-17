var gulp = require('gulp');
var mocha = require('gulp-mocha');

gulp.task('default', function() {
  gulp.watch(['lib/**', 'test/**'], ['test']);
});

gulp.task('test', function() {
  return gulp.src(['test/test-*.js'], { read: false })
    .pipe(mocha({
      reporter: 'dot'
    }));
});