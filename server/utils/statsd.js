module.exports = function(...args) {
  return (req, res, next) => {
    const method = req.method || "unknown_method";

    req.statsdKey = ["pois", ...args, method.toLowerCase()].join(".");

    next();
  };
}
