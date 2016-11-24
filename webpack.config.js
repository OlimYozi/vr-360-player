var path = require('path');
var extend = require('webpack-merge');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var TypedocWebpackPlugin = require('typedoc-webpack-plugin');

module.exports = function (env) {

  //var PROD = process.argv.indexOf('--production') != -1 || process.env.NODE_ENV == 'production';
  var PROD = env && env.production ? true : false;

  //------------------------------------------------------------------------------------
  // COMMON CONFIG FOR DEV AND PROD
  //------------------------------------------------------------------------------------

  var config = {
    context: path.resolve(process.cwd(), 'src'),

    entry: {
      'player': './player/Player',
    },

    output: {
      filename: 'vr360player.js',
      library: 'VR360Player',
      libraryTarget: 'var',
      path: path.resolve(process.cwd(), 'build'),
    },

    resolve: {
      modules: [path.resolve(process.cwd(), 'src'), 'node_modules'],
      extensions: ['.js', '.ts'],
    },

    module: {
      rules: [
        {
          test: /node_modules/,
          loader: 'ify'
        },
        {
          test: /\.ts$/,
          loader: 'awesome-typescript',
        },
        {
          test: /\.pug$/,
          loader: 'pug',
        },
        {
          test: /\.scss$/,
          loader: ExtractTextPlugin.extract({ loader: ['css', 'postcss', 'sass'] }),
        },
        {
          test: /\.(json|png|jpe?g|svg|woff2?)$/,
          loader: 'url-loader',
          query: {
            name: PROD ? 'assets/[hash].[ext]' : 'assets/[name].[ext]',
            limit: 10000,
          },
        },
      ],
    },

    plugins: [
      new webpack.LoaderOptionsPlugin({
        options: {
          postcss: [
            require('autoprefixer')(),
          ]
        }
      }),
      new HtmlWebpackPlugin({
        inject: false,
        template: './index.pug',
      }),
      new ExtractTextPlugin('./vr360player.css'),
    ],
  };

  if (PROD) {

    //------------------------------------------------------------------------------------
    // PRODUCTION SPECIFIC CONFIG
    //------------------------------------------------------------------------------------

    config = extend(true, config, {

      plugins: [
        new webpack.NoErrorsPlugin(),
        new webpack.optimize.DedupePlugin(),
        new webpack.LoaderOptionsPlugin({
          minimize: true
        }),
        new webpack.optimize.UglifyJsPlugin({
          output: {
            comments: false,
          },
          compressor: {
            warnings: false,
          },
        }),
        new webpack.DefinePlugin({
          'process.env': {
            'ENV': '"production"',
          },
        }),
        new TypedocWebpackPlugin({
          out: path.resolve(process.cwd(), 'docs'),
          tsconfig: 'tsconfig.json',
          exclude: '',
          excludePrivate: true,
          mode: 'file',
        }, ['./node_modules/@types', './project.d.ts', './src/player']),
      ],

    });

  } else {

    //------------------------------------------------------------------------------------
    // DEVELOPMENT SPECIFIC CONFIG
    //------------------------------------------------------------------------------------

    config = extend(true, config, {

      plugins: [
        new webpack.LoaderOptionsPlugin({
          debug: true
        }),
        new webpack.DefinePlugin({
          'process.env': {
            'ENV': '"development"',
          },
        }),
      ],

      devtool: 'source-map',
    });
  }

  return config;
};