import expressStatsd from "express-statsd";
import webpack from "webpack";
import webpackDevMiddleware from "webpack-dev-middleware";
import logger from "morgan";

const config = require("../../webpack.config");

module.exports = (app) => {
  app.use(expressStatsd());
  app.use(logger("dev"));

  require("../app")(app);

  // print stack traces
  app.use((err, req, res, next) => {
    const locals = {
      message: err.message,
      error: err,
    };

    res.status(err.status || 500);

    if (req.headers["content-type"] === "application/json") {
      return res.json(locals);
    }

    res.render("error", locals);
  });

  if (!process.env.NO_WEBPACK) {
    const compiler = webpack(config);

    app.use(webpackDevMiddleware(compiler, {
      publicPath: config.output.publicPath,
      contentBase: "/public",
      stats: { colors: true },
      watchOptions: {
        aggregateTimeout: 300,
        poll: true,
      },
    }));

    app.use(require("webpack-hot-middleware")(compiler));
  }
};
