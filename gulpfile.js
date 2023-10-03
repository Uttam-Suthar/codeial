const gulp = require('gulp');

const sass = require('gulp-sass');
const cssnano = require('gulp-cssnano');
const rev = require('gulp-rev');
const uglify = require('gulp-uglify-es').default;
const imagemin = require('gulp-imagemin');
const del = require('del');


// import gulp from 'gulp';
// import sass from 'gulp-sass';
// import cssnano from 'gulp-cssnano';
// import imagemin from 'gulp-imagemin';
// const del = require('del');

// import del from 'del';
//Minified css
gulp.task('css', function () {
    console.log('minifying css...');
    gulp.src('./assets/sass/**/*.scss')
        .pipe(sass())
        .pipe(cssnano())
        .pipe(gulp.dest('./assets/css'));  // Corrected destination path

    return gulp.src('./assets/**/*.css')
        .pipe(rev())
        .pipe(gulp.dest('./public/assets/css'))  // Corrected destination path
        .pipe(rev.manifest({
            cwd: 'public',
            merge: true
        }))
        .pipe(gulp.dest('./public/assets'));
});

// gulp.task('css', async function () {
//     console.log('minifying css...');

    // Import gulp-rev as an ESM module
//     const { default: rev } = await import('gulp-rev');

//     return gulp.src('./assets/sass/**/*.scss')
//         .pipe(sass())
//         .pipe(cssnano())
//         .pipe(rev())
//         .pipe(gulp.dest('./public/assets'))
//         .pipe(rev.manifest({
//             cwd: 'public',
//             merge: true
//         }))
//         .pipe(gulp.dest('./public/assets'));
// });


//Minified javascript
gulp.task('js', function (done) {
    console.log('minifying js...');
    gulp.src('./assets/**/*.js')
        .pipe(uglify())
        .pipe(rev())
        .pipe(gulp.dest('./public/assets'))
        .pipe(rev.manifest({
            cwd: 'public',
            merge: true
        }))
        .pipe(gulp.dest('./public/assets'));
    done()
});

//Minified images
gulp.task('images', function (done) {
    console.log('compressing images...');
    gulp.src('./assets/**/*.+(png|jpg|gif|svg|jpeg)')
        .pipe(imagemin())
        .pipe(rev())
        .pipe(gulp.dest('./public/assets'))
        .pipe(rev.manifest({
            cwd: 'public',
            merge: true
        }))
        .pipe(gulp.dest('./public/assets'));
    done();
});

//Whenever server will restart all old work done by gulp will be deleted and it will perform all the tasks and minificatin again
// empty the public/assets directory
gulp.task('clean:assets', function (done) {
    del.sync('./public/assets');
    done();
});

//Run all the taks one by one 
gulp.task('build', gulp.series('clean:assets', 'css', 'js', 'images'), function (done) {
    console.log('Building assets');
    done();
});