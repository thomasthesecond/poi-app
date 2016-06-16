var ManifestPlugin = require("webpack-manifest-plugin");
var webpack = require("webpack");
var config = require("./webpack.config");
var path = require("path");
var ExtractTextPlugin = require("extract-text-webpack-plugin");


config.plugins = [
  new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /en-gb|en-eu|eu/),
  new webpack.optimize.OccurenceOrderPlugin(),
  new webpack.optimize.CommonsChunkPlugin({
    name: "common",
    minChunks: 3,
  }),
  new webpack.optimize.DedupePlugin(),
  new webpack.ProvidePlugin({
    $: path.join(__dirname, "node_modules", "jquery/dist/jquery"),
    jQuery: path.join(__dirname, "node_modules", "jquery/dist/jquery")
  }),
  new ManifestPlugin(),
  new webpack.optimize.UglifyJsPlugin({
    compress: {
      warnings: false,
    },
  }),
  new ExtractTextPlugin("[name].[chunkhash:20].css", {
    disable: false,
    allChunks: true,
  }),
  new webpack.DefinePlugin({
    "process.env": {
      "NODE_ENV": JSON.stringify("production"),
      "ASSET_HOST": JSON.stringify(process.env.ASSET_HOST),
      "OPEN_PLANET_HOST": JSON.stringify(process.env.OPEN_PLANET_HOST),
    },
  }),
];

config.loaders = [{
  test: /\.css$/,
  loader: ExtractTextPlugin.extract("style", "css?minimize")
}, {
  test: /\.scss$/,
  loader: ExtractTextPlugin.extract("style", "css?minimize" +
    "!sass&" +
    "includePaths[]=" + path.resolve(__dirname, "./node_modules")),
}, {
  test: /(\.jsx?)$/,
  loader: "babel?presets[]=es2015&plugins[]=transform-decorators-legacy",
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
}];

config.entry.common = ["assets/common"];
config.debug = false;
config.progress = false;
config.output.filename = "[name].[chunkhash:20].js";
config.devtool = null;

module.exports = config;
