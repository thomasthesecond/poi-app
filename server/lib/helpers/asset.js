let manifest;

const host = process.env.ASSET_HOST || "";

if (process.env.NODE_ENV === "production") {
  manifest = require("../../../../public/assets/manifest.json");
}
/**
 * asset helper
 * @example
 *
 * {{{asset "app.js"}}}
 * {{{asset "app.css"}}}
 *
 * @param  {string} name  Name of the asset to load
 * @param  {boolean} async Add the async attribute
 * @return {string}       Script or link tag
 */
module.exports = (name) => {
  const isJs = name.indexOf("js") > -1;

  // if (!isJs && process.env.NODE_ENV !== "production") {
  //   // In development we don't extract css
  //   return "";
  // }
  if (manifest) {
    name = manifest[name];
  }

  return isJs ?
    `<script src="${host}/assets/${name}"></script>` :
    `<link rel="stylesheet" href="${host}/assets/${name}" />`;
};
