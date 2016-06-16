"use strict";

/* jshint node:true */
// TODO: This can eventually be removed, but not yet...
// https://github.com/jtangelder/sass/pull/132/files
process.env.UV_THREADPOOL_SIZE = 100;

require("dotenv").config({ path: (process.env.ENV_PATH || ".env") });
require("es6-promise").polyfill();

const path = require("path");
const webpack = require("webpack");
const fs = require("fs");

// Setup webpack plugins
const CommonsPlugin = new require("webpack/lib/optimize/CommonsChunkPlugin");
const provide = new webpack.ProvidePlugin({
  $: path.join(__dirname, "node_modules", "jquery/dist/jquery"),
  jQuery: path.join(__dirname, "node_modules", "jquery/dist/jquery"),
});
const ExtractTextPlugin = require("extract-text-webpack-plugin");


let plugins = [
  new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /en-gb|en-eu|eu/),
  new webpack.optimize.OccurenceOrderPlugin(),
  new CommonsPlugin({
    name: "common",
    minChunks: 3,
  }),
  provide,
  new webpack.HotModuleReplacementPlugin(),
  new ExtractTextPlugin("[name].css", {
    disable: false,
    allChunks: true,
  }),
  new webpack.DefinePlugin({
    "process.env": {
      NODE_ENV: JSON.stringify("development"),
      ASSET_HOST: JSON.stringify(process.env.ASSET_HOST),
      OPEN_PLANET_HOST: JSON.stringify(process.env.OPEN_PLANET_HOST),
    },
  }),
];

// Dynamically build entry files
const basePath = path.join(__dirname, "app");
const vendorPath = path.join(__dirname, "node_modules");

module.exports = {
  debug: true,
  progress: true,
  context: basePath,
  entry: {
    common: ["webpack-hot-middleware/client", "assets/common"],
    universal: "assets/universal",
    home: "assets/home",
  },
  output: {
    path: path.join(__dirname, "public", "assets"),
    filename: "[name].js",
    chunkFilename: "[name]_[chunkhash:20].js",
    publicPath: "/assets/",
    libraryTarget: "var",
  },
  module: {
    noParse: /node_modules\/(jquery)$/,
    // preLoaders: [{
    //   test: /\.jsx?$/,
    //   loader: "eslint-loader",
    //   exclude: /node_modules/,
    // }],
    loaders: [{
        test: /\.css$/,
        loader: ExtractTextPlugin.extract("style", "css")
      }, {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract("style", "css" +
          "!sass?outputStyle=expanded&" +
          "includePaths[]=" + path.resolve(__dirname, "./node_modules")),
      },
      // Splitting out jsx for react-hot loader for now, had an issue where non JSX components
      // weren't rendering.
      {
        test: /(\.jsx)$/,
        loader: "react-hot!babel?presets[]=es2015," +
          `presets[]=${require.resolve('babel-preset-stage-1')}&` +
          "plugins[]=transform-decorators-legacy",
        // Excluding everything EXCEPT rizzo-next and flamsteed
        exclude: /node_modules\/(?!rizzo\-next|flamsteed).*/,
      }, {
        test: /(\.js)$/,
        loader: "babel?presets[]=es2015," +
          `presets[]=${require.resolve('babel-preset-stage-1')}&` +
          "plugins[]=transform-decorators-legacy",
        // Excluding everything EXCEPT rizzo-next and flamsteed
        exclude: /node_modules\/(?!rizzo\-next|flamsteed).*/,
      }, {
        test: /\.json$/,
        loader: "json",
      }, {
        test: /\.hbs$/,
        // Fix a doozie of a bug where we were using the CJS version of the runtime
        loader: "handlebars?runtime=" + require.resolve("handlebars/dist/handlebars.runtime") +
          "&rootRelative=" + path.resolve(__dirname, "./node_modules/rizzo-next/src/") + "/"
      }, {
        test: /\.otf$|\.eot\??$|\.svg$|\.woff$|\.ttf$|\.png$/,
        loader: "file?name=[name].[ext]",
      }, {
        test: /picker(.date)?.js$/,
        loader: "imports?define=>false",
      }, {
        test: /jquery.dfp$/,
        loader: "imports?define=>false",
      }
    ],
  },
  resolve: {
    extensions: ["", ".js", ".jsx"],
    root: [basePath, vendorPath],
    fallback: path.join(__dirname, "node_modules"),
  },
  // Fallback to the node_modules directory if a loader can't be found
  // Basically for when you `npm link rizzo-next`
  resolveLoader: {
    fallback: path.join(__dirname, "node_modules"),
  },
  plugins: plugins,
};
