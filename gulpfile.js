var gulp = require('gulp');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var browserSync = require('browser-sync').create();

gulp.task('browserSync', function() {
    browserSync.init({
        server: {
            baseDir: 'app'
        }
    });
});

gulp.task('sass', () => {
    return gulp.src('app/assets/styles/sass/*.sass')
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('app/assets/styles/css'))
        .pipe(browserSync.reload({
            stream: true
        }));
});

gulp.task('watch', ['browserSync', 'sass'], () => {
    gulp.watch('app/assets/styles/**/*.sass', ['sass']);
    gulp.watch('app/*.html', browserSync.reload);
    gulp.watch('app/*.hbs', browserSync.reload);
    gulp.watch('app/**/*.js', browserSync.reload);
});
