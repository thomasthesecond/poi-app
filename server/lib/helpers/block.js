var blocks = {};
module.exports = function(name) {
  var val = (blocks[name] || []).join("\n");

  // clear the block
  blocks[name] = [];
  return val;
};
