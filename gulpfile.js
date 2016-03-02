// Require
// ---------------------------------------
var fs          = require('fs');
var gulp        = require('gulp');
var compass     = require('gulp-compass');
var plumber     = require('gulp-plumber');
var notify      = require('gulp-notify');
var browserSync = require('browser-sync');

// Path Configure
// ---------------------------------------
// Root Directory
var src_root = 'src/';
var pub_root = 'public/';
var doc_root = 'doc/';

// Source Directories
var src = {
    sass: src_root + 'sass/',
    js: src_root + 'js/'
}

// Public Directories
var pub = {
    css: pub_root + 'assets/css/',
    js: pub_root + 'assets/js/',
    img: pub_root + 'assets/img/',
}

// Document Directories
// No Directory

// Files function
var file = function(extName_, min_){
    var all_dir = '**/*.';
    var file_path = null;
    if(min_){
        file_path = extName_;
    }else{
        file_path = all_dir + extName_;
    }
    return file_path;
};

var file_path = {
    scss: src.sass + file('scss'),
    css: pub.css + file('css'),
    js: pub.js + file('js'),
    html: pub_root + file('html')
}

console.log(file_path);

// Notify Massage
var notify = {
    errorHandler: notify.onError('<%= error.message %>')
};

// Task
// ---------------------------------------
// Compass + Sass
gulp.task('compass', function(){
    gulp.src(file_path.scss)
        .pipe(plumber(notify))
        .pipe(compass({
            config_file: src.sass + 'config.rb',
            comments: false,
            css: pub.css,
            sass: src.sass
        }))
        .pipe(browserSync.reload({stream: true}));
});
// browserSync
gulp.task('browser-sync', function () {
    browserSync({
        server: {
            baseDir: pub_root
        },
        open: 'external',
    });
    gulp.watch([file_path.js, file_path.html], function() {
        browserSync.reload();
    });
});

// Build
// ---------------------------------------
gulp.task('default',['browser-sync'], function(){
    gulp.watch(file_path.scss,['compass']);
});
