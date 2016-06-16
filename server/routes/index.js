"use strict";

import express from "express";
import mvc from "../lib/mvc";

const router = express.Router();

mvc.initialize(router);

const exclude = /assets|__webpack_hmr|health\-check|styleguide/;

router.get("/:slug(*)", (req, res, next) => {
  // Skip over any asset routes
  if (req.params.slug.match(exclude)) {
    return next();
  }

  return next();

  // TODO: Have a discussion about this... https://github.com/lonelyplanet/dotcom-pois/issues/160
  // const isJson = req.params.slug.match(/.json$/);
  // const slugToId = require("../lib/slug_to_id");
  //
  // return slugToId("ThingToDo", req.params.slug.replace(/.json$/, "")).then((poi) => {
  //   if (isJson) {
  //     return res.json(poi);
  //   }
  //   return res.redirect(302, `/poi/${poi.atlas_id}`);
  // }).catch(() => {
  //   res.sendStatus(404);
  // });
});

module.exports = router;
