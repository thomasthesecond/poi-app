"use strict";

import AppComponent from "../../app";
import HomeComponent from "../../home/home";
import UniversalComponent from "../../universal/components/universal";

const routes = {
  path: "",
  component: AppComponent,
  childRoutes: [{
    path: "/",
    component: HomeComponent,
  }, {
    path: "/universal",
    component: UniversalComponent,
  }],
};

export { routes };
