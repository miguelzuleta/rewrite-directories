'use strict'

import gulp         from 'gulp'
import htmlmin      from 'gulp-htmlmin'
import scss         from 'gulp-sass'
import concat       from 'gulp-concat'
import connect      from 'gulp-connect'
import gulpif       from 'gulp-if'
import uglify       from 'gulp-uglify'
import scssLint     from 'gulp-scss-lint'
import autoprefixer from 'gulp-autoprefixer'
import eslint       from 'gulp-eslint'
import include      from "gulp-include"
import rename       from "gulp-rename"
import sourcemaps   from 'gulp-sourcemaps'

import jsStylish    from 'jshint-stylish'
import browserify   from 'browserify'
import reactify     from 'reactify'
import watchify     from 'watchify'
import buffer       from 'vinyl-buffer'
import source       from 'vinyl-source-stream'
import babelify     from 'babelify'
import fs           from 'fs'
import { argv }     from 'yargs'

import files        from './write-files.js'

let dir = './site/'
let cssOutput = 'expanded'
let cssComments = true
let showSourcemaps = true
let minifyHMTL = false
let runConnect = ['connect']
let runWatch = []

if (!fs.existsSync(dir)) {
	fs.mkdirSync(dir)
}

if (argv.prod) {
	cssOutput = 'compressed'
	cssComments = false
	minifyHMTL = true
	showSourcemaps = false
}

if (argv.watch) {
	runWatch = ['watch']
}

if (argv.deploy) {
	runConnect = []
}

gulp.task('connect', () => {
	connect.server({
		root: dir,
		livereload: true
	})
})

gulp.task('html', () => {
	gulp.src('components/html/*.html')
		.pipe(include())
		.pipe(htmlmin({
			collapseWhitespace: minifyHMTL
		}))
		.pipe(gulp.dest(dir))
		.pipe(connect.reload())
})

gulp.task('scss-lint', () => {
	gulp.src('components/scss/*.scss')
		.pipe(scssLint())
})

gulp.task('lint', () => {
	return gulp.src(['components/js/*.js', '!node_modules/**'])
		.pipe(eslint({
			"parserOptions": {
				"ecmaVersion": 6,
				"sourceType": "module",
				"ecmaFeatures": {
					"jsx": true
				}
			},
			"rules": {
				"no-extra-semi": "error"
			}
		}))
		.pipe(eslint.format())
		.pipe(eslint.failAfterError())
})

gulp.task('scss', () => {
	gulp.src('components/scss/styles.scss')
		.pipe(gulpif(showSourcemaps, sourcemaps.init()))
			.pipe(scss({
				outputStyle: cssOutput,
				sourceComments: cssComments
			}).on('error', scss.logError))
			.pipe(autoprefixer({
				browsers: ['last 5 versions'],
				cascade: false
			}))
		.pipe(gulpif(showSourcemaps, sourcemaps.write()))
		.pipe(gulp.dest(dir))
		.pipe(connect.reload())
})

gulp.task('js', () =>  {
	browserify({
			entries: 'components/js/index.js',
			debug: showSourcemaps,
			transform: [ babelify, reactify ]
		})
		.bundle()
		.pipe(source('components/js/index.js'))
		.pipe(buffer())
		.pipe(rename('js.js'))
		.pipe(gulpif(!showSourcemaps, uglify()))
		.pipe(gulp.dest(dir))
		.pipe(connect.reload())
})

gulp.task('watch', () => {
	console.log('\n\nWatching for changes...\n\n')
	gulp.watch('components/scss/*.scss', ['scss'])
	gulp.watch('components/html/**/*.html', ['html'])
	gulp.watch('components/js/*.js', ['js', 'lint'])
})

gulp.task('default', ['html', 'scss', 'js', 'lint', ...runConnect, ...runWatch])
