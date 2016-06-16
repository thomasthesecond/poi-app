"use strict";

import React from "react"; // eslint-disable-line no-unused-vars
import ReactDOM from "react-dom";
import { Router } from "react-router";
import { routes } from "./routes";
import { browserHistory } from "react-router";
import { syncHistoryWithStore } from "react-router-redux";
import { Provider } from "react-redux";
import configureStore from "./store";

require("../images/mapPin-primary.png");
require("../images/mapPin-secondary.png");

export default function configureClient(initialState, element = "app") {
  const store = configureStore(initialState);
  const history = syncHistoryWithStore(browserHistory, store);

  ReactDOM.render(
    <Provider store={store}>
      <Router routes={routes} history={history} />
    </Provider>,
    document.getElementById(element)
  );

  document.body.className += " is-ready";
}
