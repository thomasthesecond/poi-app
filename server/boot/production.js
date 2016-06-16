import os from "os"
import path from "path";
import express from "express";
import expressStatsd from "express-statsd";
import bunyan from "express-bunyan-logger";
import Airbrake from "airbrake";
import compression from "compression";

const hostname = os.hostname();

const airbrake = Airbrake.createClient(process.env.AIRBRAKE_KEY, "production");

module.exports = (app) => {
  // Send metrics to Datadog
  app.use(expressStatsd());

  const excludes = [
    "body",
    "short-body",
    "req-headers",
    "res-headers",
    "req", "res",
    "incoming",
    "response-hrtime",
  ];
  // Logging in logstash format
  app.use(bunyan({
    parseUA: false, // Leave user-agent as raw string
    excludes,
  }));

  app.use(compression());

  app.enable('view cache');

  // load proper app
  require("../app")(app);


  if (process.env.USE_LOCAL_ASSETS) {
    app.use(express.static(path.join(__dirname, "../../../public")));
    app.use(express.static(path.join(__dirname, "../../../node_modules/rizzo-next/dist")));
  }

  // Report exceptions to Airbrake
  app.use(airbrake.expressHandler());

  // production error handler
  // no stacktraces leaked to user
  app.use((err, req, res, next) => {
    const request = req;
    request.statsdKey = ["pois", "errors", (err.status || 500)].join(".");
    res.status(err.status || 500);

    const locals = {
      message: err.message,
      error: {},
    };

    if (req.headers["content-type"] === "application/json") {
      return res.json(locals);
    }

    res.render("error", locals);
  });
}
