/*
  TODO:
    * add a production flag that disables debug/sourcemaps and minifies
 */

var webpack = require('webpack');
var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');

var autoprefixer = require('autoprefixer');
var precss       = require('precss');
var cssnext = require('cssnext');

var frontendConfig = {
  entry: [
    'webpack-hot-middleware/client',
    './src/frontend/index.js'
  ],

  output: {
    filename: 'bundle.js',
    path: path.join(__dirname, 'build', 'public')
  },

  devtool: 'sourcemap',

  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new HtmlWebpackPlugin({
      title: 'ThingiBrowse',
      filename: 'index.html',
      template: 'src/frontend/index.template.html',
      inject: true
    })
  ],

  module: {
    loaders: [
      {
        test: /\.js$/,
        include: path.join(__dirname, 'src', 'frontend'),
        loaders: ['babel']
      },
      {
        test: /\.css$/,
        include: path.join(__dirname, 'src', 'frontend'),
        loader: "style-loader!css-loader!postcss-loader"
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        loaders: [
            'file?hash=sha512&digest=hex&name=[hash].[ext]',
            'image-webpack?bypassOnDebug&optimizationLevel=7&interlaced=false'
        ]
      }
    ]
  },
  postcss: function () {
      return [autoprefixer, precss, cssnext];
  }
};

var serverConfig = {
  entry: './src/server/index.js',
  output: {
    path: path.join(__dirname, 'build'),
    filename: 'server.js',
    libraryTarget: 'commonjs2'
  },

  devtool: 'sourcemap',

  target: 'node',
  // do not include polyfills or mocks for node stuff
  node: {
    console: false,
    global: false,
    process: false,
    Buffer: false,
    __filename: false,
    __dirname: false
  },
  // all non-relative modules are external
  // abc -> require('abc')
  externals: /^[a-z\-0-9]+$/,

  plugins: [
    // enable source-map-support by installing at the head of every chunk
    new webpack.BannerPlugin('require("source-map-support").install();',
      {raw: true, entryOnly: false})
  ],

  module: {
    loaders: [
      {
        // transpile all .js files using babel
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel'
      }
    ]
  }
};

module.exports = [frontendConfig, serverConfig];
