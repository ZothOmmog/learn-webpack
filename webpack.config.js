const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetWebpackPlugin = require('optimize-css-assets-webpack-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

const isDev = process.env.NODE_ENV === 'development';
const isProd = !isDev;

const optimization = () => {
  const config = {
    splitChunks: {
      chunks: 'all'
    },
  };

  if(isProd) {
    config.minimizer = [
      new OptimizeCssAssetWebpackPlugin(),
      new TerserWebpackPlugin()
    ]
  }

  return config;
};

const cssLoaders = () => [
  {
    loader: MiniCssExtractPlugin.loader,
    options: {
      hmr: isDev,
      reloadAll: true
    }
  },
  'css-loader'
];

const jsLoaders = () => {
  const loaders = [{
    loader: 'babel-loader',
    options: {
      presets: ['@babel/preset-env'],
      plugins: ['@babel/plugin-proposal-class-properties'],
    },
  }];

  if(isDev) loaders.push('eslint-loader');

  return loaders;
}

const plugins = () => {
  const base = [
    new HTMLWebpackPlugin({
      template: './index.html',
      minify: {
        collapseWhitespace: isProd,
      },
    }),
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, 'src/favicon.ico'),
          to: path.resolve(__dirname, 'dist'),
        },
      ],
    }),
    new MiniCssExtractPlugin({
      filename: isProd ? '[name].[contenthash].css' : '[name].css',
    }),
  ]

  if(isProd) base.push(new BundleAnalyzerPlugin());

  return base;
}

module.exports = {
  context: path.resolve(__dirname, 'src'),
  mode: 'development',
  entry: {
    main: ['@babel/polyfill', './index.jsx'],
    analytics: './analytics.ts',
  },
  output: {
    filename: isProd ? '[name].[contenthash].js' : '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  resolve: {
    extensions: ['.js', '.json', '.png', '.css'],
    alias: {
      '@models': path.resolve(__dirname, 'src/models'),
    },
  },
  optimization: optimization(),
  devServer: {
    port: 4200,
    hot: isDev,
  },
  devtool: isDev ? 'source-map' : '',
  plugins: plugins(),
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [...cssLoaders()],
      },
      {
        test: /\.less$/,
        use: [...cssLoaders(), 'less-loader'],
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        use: [
          {
            loader: 'file-loader',
          },
        ],
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: jsLoaders()
      },
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        loader: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env',
              '@babel/preset-typescript'
            ],
            plugins: [
              '@babel/plugin-proposal-class-properties', 
            ],
          },
        },
      },
      {
        test: /\.jsx$/,
        exclude: /node_modules/,
        loader: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env',
              '@babel/preset-react'
            ],
            plugins: [
              '@babel/plugin-proposal-class-properties', 
            ],
          },
        },
      },
    ],
  },
};