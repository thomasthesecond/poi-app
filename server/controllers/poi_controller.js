/**
 * GET /add
 */
const show = {
  method: "GET",
  route: "/poi/:id",
  handler(req, res) {
    res.render("add", {
      __initialState: JSON.stringify({}),
    });
  },
};

module.exports = {
  show,
};
