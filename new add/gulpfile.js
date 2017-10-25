// 获取 gulp
var gulp = require('gulp')

// 获取 uglify 模块（用于压缩 JS）
var uglify = require('gulp-uglify')
// 获取 minify-css 模块（用于压缩 CSS）

var minifyCSS = require('gulp-minify-css')

gulp.task('uglifyjs', function () {
    gulp.src('src/js/**/*.js')
        .pipe(uglify())
        .pipe(gulp.dest('dist/src/js'))
})

gulp.task('default', function () {
    gulp.watch('src/js/**/*.js', ['uglifyjs'])
    gulp.watch('src/css/*.css', ['css'])

})

// 压缩 css 文件
// 在命令行使用 gulp css 启动此任务
gulp.task('css', function () {
// 1. 找到文件
gulp.src('src/css/*.css')
// 2. 压缩文件
.pipe(minifyCSS())
// 3. 另存为压缩文件
.pipe(gulp.dest('dist/src/css'))
})

// 在命令行使用 gulp auto 启动此任务
gulp.task('auto', function () {
// 监听文件修改，当文件被修改则执行 css 任务
gulp.watch('src/css/*.css', ['css'])

});