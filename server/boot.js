/* global process,__dirname */
const env = process.env.NODE_ENV || "development";

const express = require("express");
const helmet = require('helmet');
const path = require("path");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const cors = require("cors");
const utilityRoutes = require("./routes/utility");
const Promise = require("bluebird");

global.Promise = Promise;

const app = express();

const exphbs = require("express-handlebars");
const helpers = require("./lib/helpers");
const hbs = exphbs.create({
  helpers,
  defaultLayout: "main",
  layoutsDir: "app/layouts",
  partialsDir: [
    "node_modules/rizzo-next/src",
    "app",
  ],
  extname: ".hbs",
});

app.set("views", "app");

// Register `hbs` as our view engine using its bound `engine()` function.
app.engine("hbs", hbs.engine);
app.set("view engine", "hbs");

app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "node_modules/rizzo-next/dist")));
app.use(cors());

app.use((req, res, next) => {
  const data = require("rizzo-next/lib/data/default.json");

  data.components.header.type = "narrow";

  Object.assign(res.locals, {
    footer: data.components.footer,
    show_header: true,
    header: data.components.header,
    asset_root: process.env.ASSET_HOST,
  });
  next();
});

app.use((req, res, next) => {
  if (req.originalUrl.indexOf(".json") > -1) {
    req.headers["content-type"] = "application/json";
  }

  next();
});

if (env === "production") {
  require("./boot/production")(app);
} else if (env === "test") {
  require("./boot/test")(app);
} else {
  require("./boot/development")(app);
}

// adds "/error" and "/server-status" endpoints
app.use("/", utilityRoutes);

// Catch all route
app.use((req, res, next) => {
  req.statsdKey = ["pois", "errors", 404].join(".");

  const err = new Error("Not Found");
  err.status = 404;
  next(err);
});

module.exports = app;
