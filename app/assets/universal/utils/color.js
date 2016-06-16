"use strict";

import color from "color";

/**
 * Convert a hex value into RGB
 * @param  {String} hex    Hexidecimal color value to change
 * @return {String}        RGB values
 */
function rgb(hex) {
  return color(hex).rgbArray().join(",");
}

/**
 * Replicate Sass's darken function
 * @param  {String} hex    Hexidecimal color value to modify
 * @param  {Number} amount Amount to lighten, between 1 and 100
 * @return {String}        New hexidecimal color value
 */
function darken(hex, amount) {
  return color(hex).darken((amount / 100)).hexString();
}

/**
 * Replicate Sass's lighten function
 * @param  {String} hex    Hexidecimal color value to modify
 * @param  {Number} amount Amount to lighten, between 1 and 100
 * @return {String}        New hexidecimal color value
 */
function lighten(hex, amount) {
  return color(hex).lighten((amount / 100)).hexString();
}

export {
  rgb,
  darken,
  lighten,
};
