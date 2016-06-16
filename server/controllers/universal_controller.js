import React from "react";
import { renderToString } from "react-dom/server";
import { match, RouterContext } from "react-router";
import { Provider } from "react-redux";
import configureStore from "../../app/assets/shared/store";
import { routes } from "../../app/assets/shared/routes";
import env from "../utils/env";
// Use rizzo-next import and delete local import when this issue is resolved:
// https://github.com/lonelyplanet/dotcom-pois/issues/167
// import MobileUtil from "rizzo-next/src/core/mobile_util";
import MobileUtil from "../utils/mobileUtil";

// Create a cache object for storing rendered react components
const cache = Object.create(null);

// Fetch the POI before every handler in this controller
const before = (req, res, next) => {
  return next();
};

/**
 * get /universal
 */
const show = {
  method: "get",
  route: "/universal",
  handler(req, res) {
    if (req.get("content-type") === "application/json") {
      return res.json(req.place);
    }

    if (env.production && cache[req.url]) {
      return res.render("index", cache[req.url]);
    }

    // Run react router against the url
    return match({ routes, location: req.url }, (err, redirectLocation, props) => {
      if (err) {
        res.status(500).send(err.message);
      } else if (redirectLocation) {
        res.redirect(302, redirectLocation.pathname + redirectLocation.search);
      } else if (props) {
        const state = {
          userAgent: req.headers["user-agent"],
          mobile: MobileUtil.isMobile(req.headers["user-agent"]),
        };

        const store = configureStore(state);

        const markup = renderToString(
          <Provider store={store}>
            <RouterContext {...props} />
          </Provider>
        );

        cache[req.url] = {
          markup,
          __initialState: JSON.stringify(state),
        };

        res.render("universal", cache[req.url]);
      } else {
        res.sendStatus(404);
      }
    });
  },
};

module.exports = {
  before,
  show,
};
