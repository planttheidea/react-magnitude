'use strict';

const webpack = require('webpack');
const OptimizeJsPlugin = require('optimize-js-plugin');

const defaultConfig = require('./webpack.config');

module.exports = Object.assign({}, defaultConfig, {
  cache: false,

  devtool: undefined,

  output: Object.assign({}, defaultConfig.output, {
    filename: 'remeasure.min.js'
  }),

  plugins: defaultConfig.plugins.concat([
    new webpack.LoaderOptionsPlugin({
      debug: false,
      minimize: true
    }),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        booleans: true,
        conditionals: true,
        dead_code: true,
        drop_console: true,
        drop_debugger: true,
        evaluate: true,
        join_vars: true,
        screw_ie8: true,
        sequences: true,
        unused: true,
        warnings: false
      },
      sourceMap: false
    }),
    new OptimizeJsPlugin({
      sourceMap: false
    })
  ])
});
