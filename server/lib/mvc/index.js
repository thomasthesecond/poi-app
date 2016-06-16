import statsD from "../../utils/statsd";
import { getControllers } from "./utils";

const allowedMethods = [{
  handler: "show",
  method: "get",
}, {
  handler: "list",
  method: "get",
}, {
  handler: "update",
  method: "put",
}, {
  handler: "create",
  method: "post",
}, {
  handler: "delete",
  method: "delete",
}];

const initialize = (router, controllers) => {
  controllers.forEach((c) => {
    const controller = c.controller;

    const route = controller.options.baseRoute || c.route;
    const nooptBefore = (req, res, _next) => { _next(); };
    const before = controller.before ? controller.before : nooptBefore;

    for (const handler in controller) {
      if (handler === "options") continue;

      if (typeof controller[handler] === "object") {
        const options = controller[handler];
        const handlerRoute = options.route === "/" ? "" : options.route;

        const { baseRoute } = controller.options;

        router[options.method.toLowerCase()](`${baseRoute}${handlerRoute}`,
          options.skipBefore ? nooptBefore : before,
          statsD(controller.name, handler),
          options.handler
        );

        continue;
      }

      const allowed = allowedMethods.filter((m) => m.handler === handler)[0];

      if (allowed) {
        if (handler === "list") {
          router.get(`/${route}s\.:ext?`,
            before,
            statsD(controller.name, handler),
            controller[handler]
          );
        } else {
          router[allowed.method](`/${route}/:id\.:ext?`,
            before,
            statsD(controller.name, handler),
            controller[handler]
          );
        }
      }
    }
  });
};

const api = {
  initialize(router) {
    return initialize(router, getControllers());
  },
};

export { initialize };

export default api;
