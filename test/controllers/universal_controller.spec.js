"use strict";

import request from "supertest";
import app from "../../server/boot";

const server = request.agent(app);
const ua = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_1) AppleWebKit/537.36" +
 "(KHTML, like Gecko) Chrome/49.0.2623.112 Safari/537.36";

// Have to have `function` rather than fat arrow to keep `this` in tact
describe("places_controller", function poiController() {
  this.timeout(3000);

  it("should get the ryman", (done) => {
    server
      .get("/universal")
      .set("user-agent", ua)
      .expect(200, done);
  });

  it("should 404 for a bad link", (done) => {
    server
      .get("/foobar")
      .expect(404, done);
  });
});
