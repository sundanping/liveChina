// 获取 gulp
var gulp = require('gulp')

// 获取 uglify 模块（用于压缩 JS）
var uglify = require('gulp-uglify')
// 获取 minify-css 模块（用于压缩 CSS）

var minifyCSS = require('gulp-minify-css')
// 获取 gulp-imagemin 模块
var imagemin = require('gulp-imagemin')
// 压缩 js 文件
var rev = require('gulp-rev-collector');

// 在命令行使用 gulp script 启动此任务
gulp.task('script', function() {
    // 1. 找到文件
    gulp.src('src/js/*.js')
    // 2. 压缩文件
        .pipe(rev())
        .pipe(gulp.dest('dist/js'))
        .pipe(uglify())
        // 3. 另存压缩后的文件
        .pipe(gulp.dest('dist/js'))
})

// 在命令行使用 gulp auto 启动此任务
gulp.task('uglifyjs', function () {
    // 监听文件修改，当文件被修改则执行 script 任务
    gulp.watch('src/js/*.js', ['script'])
})

// 压缩 css 文件
// 在命令行使用 gulp css 启动此任务
gulp.task('css', function () {

    // 1. 找到文件
    gulp.src('src/css/*.css')
    // 2. 压缩文件
        .pipe(rev())
        .pipe(gulp.dest('dist/css'))
        .pipe(minifyCSS())
        // 3. 另存为压缩文件
        .pipe(gulp.dest('dist/css'))
})


// 在命令行使用 gulssp auto 启动此任务
gulp.task('autoCss', function () {
    // 监听文件修改，当文件被修改则执行 css 任务
    gulp.watch('src/css/*.css', ['css'])
})
// 使用 gulp.task('default') 定义默认任务
// 在命令行使用 gulp 启动 script 任务和 auto 任务


gulp.task('images', function () {
    // 1. 找到图片
    gulp.src('src/imgs/*.*')
    // 2. 压缩图片
        .pipe(imagemin({
            progressive: true
        }))
        // 3. 另存图片
        .pipe(gulp.dest('dist/imgs'))
});


var revCollector = require('gulp-rev-collector');
var minifyHTML   = require('gulp-minify-html');

gulp.task('rev', function () {
    return gulp.src(['rev/**/*.json', 'templates/**/*.html'])
        .pipe( revCollector({
            replaceReved: true,
            dirReplacements: {
                'css': '/dist/css',
                '/js/': '/dist/js/',
                'cdn/': function(manifest_value) {
                    return '//cdn' + (Math.floor(Math.random() * 9) + 1) + '.' + 'exsample.dot' + '/img/' + manifest_value;
                }
            }
        }) )
        .pipe( minifyHTML({
            empty:true,
            spare:true
        }) )
        .pipe( gulp.dest('dist') );
});
gulp.task('default', ['uglifyjs','autoCss','images'])



