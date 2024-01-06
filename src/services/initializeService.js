const { connectToDatabase, createTables } = require("./databaseService");
const rateLimitMiddleware = require("../middleware/rateLimitMiddleware");
const initRoutes = require("../routes/web");
const bodyParser = require("body-parser");

const initializeApp = async (app) => {
  // Connect to the database
  await connectToDatabase();

  // create tables
  await createTables();

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  // ratelimiter middleware
  app.use(rateLimitMiddleware);

  // initialise routes
  initRoutes(app);
};

module.exports = initializeApp;
