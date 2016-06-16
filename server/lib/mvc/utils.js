import path from "path";

const fs = require("fs");

const getControllers = () => {
  const controllers = fs.readdirSync(path.join(__dirname, "../../controllers"));

  return controllers.map((c) => {
    const controller = require(`../../controllers/${c}`);
    const options = controller.options || { baseRoute: "" };
    const name = c.replace(/\_controller\.js$/, "");

    return {
      route: options.baseRoute || name,
      controller: Object.assign({}, controller, {
        options,
        name,
      }),
    };
  });
};

export { getControllers };
