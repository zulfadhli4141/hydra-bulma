const gulp = require('gulp')
const browserSync = require('browser-sync').create()
const sourcemaps = require('gulp-sourcemaps')
const sass = require('gulp-sass')
const csso = require('gulp-csso')
const shorthand = require('gulp-shorthand')
const autoprefixer = require('gulp-autoprefixer')
const babel = require('gulp-babel')
const concat = require('gulp-concat')
const uglify = require('gulp-uglify')
const uglifyCss = require('gulp-uglifycss')
const nunjucksRender = require('gulp-nunjucks-render')
const prettyUrl = require('gulp-pretty-url')
const del = require('del')

gulp.task('browserSync', () => {
  browserSync.init({
    server: {
      baseDir: 'dist'
    },
    open: false
  })
})

gulp.task('html', () => {
  return gulp.src('src/*.html')
    .pipe(nunjucksRender({
      path: ['src/layouts/'],
    }))
    .pipe(prettyUrl())
    .pipe(gulp.dest('dist'))
});

gulp.task('assets-css', () => {
  return gulp.src('node_modules/bulma/sass/**/*')
    .pipe(gulp.dest('src/sass/bulma'))
});

gulp.task('assets-css2', () => {
  return gulp.src('node_modules/bulma/bulma.sass')
    .pipe(gulp.dest('src/sass'))
});

gulp.task('assets-css3', () => {
  return gulp.src(['node_modules/font-awesome/fonts/*'])
    .pipe(gulp.dest('src/sass/font-awesome/fonts'))
});

gulp.task('assets-css4', () => {
  return gulp.src(['node_modules/font-awesome/scss/*'])
    .pipe(gulp.dest('src/sass/font-awesome/scss'))
});

gulp.task('assets-js', () => {
  return gulp.src([
    // 'node_modules/jquery/dist/jquery.slim.min.js',
  ])
    .pipe(gulp.dest('dist/vendor'))
});

gulp.task('assets', ['assets-js','assets-css4', 'assets-css3', 'assets-css2', 'assets-css'])

gulp.task('sass', () => {
  return gulp.src('src/sass/main.sass')
    .pipe(sass())
    .pipe(sourcemaps.init())
    .pipe(csso())
    .pipe(shorthand())
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(concat('bundle.css'))
    .pipe(uglifyCss())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('dist'))
    .pipe(browserSync.stream())
})

gulp.task('babel', () => {
  return gulp.src([
    'src/js/app.js'
  ])
    .pipe(sourcemaps.init())
    .pipe(babel({
      presets: ['env']
    }))
    .pipe(concat('bundle.js'))
    .pipe(uglify())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest("dist"))
    .pipe(browserSync.stream())
})

gulp.task('js', ['babel'], (done) => {
  browserSync.reload();
  done();
});

gulp.task('img', () => {
  return gulp.src("src/img/*")
  .pipe(gulp.dest("dist/img"))
});

gulp.task('clean', (done) => {
  del('dist')
  done()
});

gulp.task('watch', ['browserSync', 'sass', 'js', 'babel', 'html'], () => {
  gulp.watch('src/*.html', ['html'])
  gulp.watch('src/layouts/*.html', ['html'])
  gulp.watch('src/sass/main.sass', ['sass'])
  gulp.watch('src/js/app.js', ['babel'])
  gulp.watch('src/js/app.js', ['js'])
  gulp.watch("dist/*.html").on('change', browserSync.reload);
})
