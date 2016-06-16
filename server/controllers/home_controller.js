/**
 * GET /
 */
const show = {
  method: "GET",
  route: "/",
  handler(req, res) {
    res.render("home", {
      __initialState: JSON.stringify({}),
    });
  },
};

module.exports = {
  show,
};
