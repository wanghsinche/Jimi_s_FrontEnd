var gulp        = require('gulp');
var browserSync = require('browser-sync').create();
var less = require('gulp-less');
var path = require('path');
var requirejsOptimize = require('gulp-requirejs-optimize');

// Static Server + watching scss/html files



gulp.task('html', function () {
    gulp.src('./src/html/**/*.html')
        .pipe(gulp.dest('./dist'));
});
gulp.task('debugJs', function () {
    gulp.src('./src/js/**/*.*')
        .pipe(gulp.dest('./dist/js'));
});
gulp.task('less', function () {
  return gulp.src('./src/less/**/*.less')
    .pipe(less({
      paths: [ path.join(__dirname, 'less', 'includes') ]
    }))
    .pipe(gulp.dest('./dist/css'));
});

gulp.task('scripts', function () {
  return gulp.src('src/js/**/*.js')
    .pipe(requirejsOptimize())
    .pipe(gulp.dest('dist'));
}); 
 
gulp.task('server', function() {

    browserSync.init({
        server: "./dist/"
    });
    gulp.watch("./src/less/**/*.less", ['less']);
    gulp.watch("./src/html/**/*.html", ['html']);    
    gulp.watch("./src/js/**/*.*", ['debugJs']);    
    gulp.watch(["./dist/*.html","./dist/css/*.css"]).on('change', browserSync.reload);

});


gulp.task('default', ['debugJs','less','html','server']);