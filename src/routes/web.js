const noteRoutes = require("./noteRoutes");
const userRoutes = require("./userRoutes");
function initRoutes(app) {
  app.use("/", noteRoutes);
  app.use("/", userRoutes);
}

module.exports = initRoutes;
