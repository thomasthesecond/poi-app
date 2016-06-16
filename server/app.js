module.exports = function(app) {
  let routes = require("./routes/index");

  app.use("/", routes);
};
