/**
 * GET /add
 */
const show = {
  method: "GET",
  route: "/add",
  handler(req, res) {
    res.render("add", {
      __initialState: JSON.stringify({}),
    });
  },
};

module.exports = {
  show,
};
