'use strict';
/** Imports */
const { join } = require('path');
const { CheckerPlugin } = require('awesome-typescript-loader');
const HtmlWebpackPlugin = require('html-webpack-plugin');


/** Constants */
const SRC_DIR = join(__dirname, 'src');
const OUT_DIR = join(__dirname, 'out/src');


/** Init */
module.exports = [
  // VS Code
  {
    entry: {
      extension: join(SRC_DIR, 'extension.ts'),
    },

    target: 'node',

    output: {
      filename: '[name].js',
      sourceMapFilename: '[file].map',
      path: OUT_DIR,
      libraryTarget: 'commonjs'
    },

    externals(context, request, callback) {
      if (/extension\.ts$/.test(request)) {
        return callback();
      }

      return callback(null, 'commonjs ' + request);
    },

    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.jsx']
    },

    devtool: 'source-map',

    module: {
      loaders: [
        {
          test: /\.tsx?$/,
          loader: 'awesome-typescript-loader'
        }
      ]
    },

    plugins: [
      new CheckerPlugin(),
    ]
  },

  // Webview
  {
    entry: {
      main: join(SRC_DIR, 'webview/index.ts'),
    },

    output: {
      filename: '[name].js',
      sourceMapFilename: '[file].map',
      path: join(OUT_DIR, 'webview')
    },

    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.jsx']
    },

    devtool: 'source-map',

    module: {
      loaders: [
        {
          test: /\.tsx?$/,
          loader: 'awesome-typescript-loader',
          options: {
            configFileName: join(SRC_DIR, 'webview/tsconfig.json')
          }
        }
      ]
    },

    plugins: [
      new CheckerPlugin(),

      new HtmlWebpackPlugin({
        filename: 'index.html',
        template: join(SRC_DIR, 'webview/index.html')
      })
    ]
  }
];
