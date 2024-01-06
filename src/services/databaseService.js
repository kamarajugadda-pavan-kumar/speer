const { Client } = require("pg");
const fs = require("fs");
const path = require("path");

const dbClient = new Client({
  host: process.env.host,
  database: process.env.database,
  port: process.env.port,
  user: process.env.user,
  password: process.env.password,
  ssl: {
    rejectUnauthorized: false,
  },
});

const MAX_RECONNECT_ATTEMPTS = 3;
let reconnectAttempts = 0;

const connectToDatabase = async () => {
  try {
    await dbClient.connect();
    console.log("Connected to PostgreSQL database");
  } catch (error) {
    console.error("Error connecting to PostgreSQL database:", error.message);
    process.exit(1);
  }
};

const disconnectFromDatabase = async () => {
  try {
    await dbClient.end();
    console.log("Disconnected from PostgreSQL database.");
  } catch (error) {
    console.error(
      "Error disconnecting from PostgreSQL database:",
      error.message
    );
  }
};

const handleDatabaseError = (error) => {
  console.error("PostgreSQL client error:", error.message);

  // Attempt to reconnect (with a limit on the number of attempts)
  if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
    console.log("Attempting to reconnect to the database...");
    reconnectAttempts++;
    connectToDatabase();
  } else {
    console.error("Exceeded maximum reconnection attempts. Exiting...");
    process.exit(1);
  }
};

const createTables = async () => {
  try {
    const createTablesQuery = fs.readFileSync(
      path.join(__dirname, "createTables.sql"),
      "utf8"
    );

    await dbClient.query(createTablesQuery);

    console.log("Tables created successfully");
  } catch (error) {
    console.error("Error creating tables:", error);
  }
};

dbClient.on("error", handleDatabaseError);

module.exports = {
  connectToDatabase,
  disconnectFromDatabase,
  createTables,
  dbClient,
};
