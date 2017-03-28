'use strict';

const gulp = require('gulp');
// const $ = require('gulp-load-plugins')();

const webpackStream = require('webpack-stream');
const webpack = webpackStream.webpack;
const named = require('vinyl-named');

const paths = {
  scripts: {
    entry: `js/src/interface.js`,
    dest: `js/`
  },
};

gulp.task('watch', () =>
  gulp
    .src(paths.scripts.entry)
    .pipe(named())
    .pipe(webpackStream({
      stats: {
        assets: false,
        colors: true,
        version: false,
        timings: true,
        chunks: true,
        chunkModules: true
      },
      watch: true,
      devtool: 'source-map',
      module: {
        loaders: [{
          test: /\.js$/,
          loader: 'babel',
          exclude: /node_modules/,
          query: {
            presets: ['es2015'],
            plugins: ['transform-runtime']
          }
        }]
      },
      plugins: [
        new webpack.NoErrorsPlugin()
      ]
    }))
    .pipe(gulp.dest(paths.scripts.dest))
);