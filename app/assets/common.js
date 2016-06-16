import "./common.scss";
import "rizzo-next/src/components/analytics";
import rizzo from "rizzo-next";
import GlobalHeader from "rizzo-next/src/components/header";
import GlobalFooter from "rizzo-next/src/components/footer";
import FastClick from "fastclick";
import "rizzo-next/src/core/utils/preload";
import "rizzo-next/src/core/utils/detect_swipe";
import "rizzo-next/src/core/event_tracker";
import "rizzo-next/src/components/ads";
import "rizzo-next/src/components/svg_icons";
import CookieUtil from "rizzo-next/src/core/cookie_util";
import postal from "postal/lib/postal.lodash";
import LoginManager from "rizzo-next/src/components/login/login_manager";
import AdManager from "rizzo-next/src/core/ads/ad_manager";
import Alert from "rizzo-next/src/components/alert";
import "rc-slider/assets/index.css";

window.LP = window.LP || {};
window.LP.loginManager = new LoginManager();

// Create LP namespace if it isn"t there already
window.lp = window.lp || {};
window.lp.ads = window.lp.ads || {};
window.lp.ads.manager = new AdManager(window.lp.ads).initialize();

rizzo.renderComponent(GlobalHeader, ".lp-global-header");
rizzo.renderComponent(GlobalFooter, ".lp-global-footer");

FastClick.attach(document.body);

if (process.env.NODE_ENV === "production") {
  require("trackjs");

  window.onerror = function onerror(message, file, line, col) {
    rizzo.logger.error({
      message,
      file,
      line,
      col,
    });
  };
}

const cookie = new CookieUtil();
cookie.setCookie("destinations-next-cookie", true, 14);

// Show cookie notification for EU users
if (cookie.getCookie("lpCurrency") && cookie.getCookie("lpCurrency").match(/GBP|EUR/)) {
  rizzo.renderComponent(Alert, {
    el: "body",
    alert: {
      type: "default",
      text: "We use cookies to improve your experience on our website."
        + "You can update your settings",
      link_text: "here",
      link: "http://www.lonelyplanet.com/legal/cookies",
    },
  });
}

if (process.env.NODE_ENV === "development") {
  postal.addWireTap((data, envelope) => {
    console.log(JSON.stringify(envelope));
  });
}

$.support.cors = true;

window.jQuery = $;
$.detectSwipe.preventDefault = false;
