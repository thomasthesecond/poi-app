"use strict";

import AppComponent from "../../app";
import HomeComponent from "../../home/home";
import AddComponent from "../../add/add";
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
  }, {
    path: "/add",
    component: AddComponent,
  }],
};

export { routes };
