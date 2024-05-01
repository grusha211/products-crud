const productRoutes = require("./productRoutes");
const userRoutes = require("./userRoutes");

const initRoutes = (app) => {
  app.use("/user", userRoutes());
  app.use("/products",productRoutes());
};

module.exports = initRoutes;
