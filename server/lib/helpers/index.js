"use strict";

let path = require("path"),
    normalizedPath = path.join(__dirname);

let helpers = {};

require("fs").readdirSync(normalizedPath).forEach(function(file) {
  let helper;
  
  if (~file.indexOf("index")) return;
 
  helper = require("./" + file);
  
  if (typeof helper === "object") {
    for(let name in helper) {
      if (helper.hasOwnProperty(name) && typeof helper[name] === "function") {
        helpers[name] = helper[name];
      }
    }
  } else if (typeof helper === "function") {
    helpers[path.basename(file, ".js")] = helper;
  }
});

module.exports = helpers;
