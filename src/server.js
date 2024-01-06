const app = require("./app");
const gracefulShutdownService = require("./services/gracefulShutdownService");

const server = app.listen(3000, () => {
  console.log("Server is running on port 3000");
  gracefulShutdownService(server);
});
