'use strict';
/** Imports */
const { join } = require('path');
const { CheckerPlugin } = require('awesome-typescript-loader');
const HtmlWebpackPlugin = require('html-webpack-plugin');


/** Constants */
const SRC_DIR = join(__dirname, 'src/webview');
const OUT_DIR = join(__dirname, 'out/src/webview');


module.exports = {
  entry: {
    main: join(SRC_DIR, 'index.ts'),
  },

  output: {
    filename: '[name].js',
    sourceMapFilename: '[file].map',
    path: OUT_DIR
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
          configFileName: join(SRC_DIR, 'tsconfig.json')
        }
      }
    ]
  },

  plugins: [
    new CheckerPlugin(),

    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: join(SRC_DIR, 'index.html')
    })
  ]
};
