import glob from "glob";

const componentPath = "app/assets/pois/components";

glob("./app/assets/pois/components/**/*.jsx", (err, components) => {
  for (const path of components) {
    const component = require(path);
    console.log(component);
  }
});
