const { disconnectFromDatabase } = require("./databaseService");

const gracefulShutdownService = (server) => {
  const cleanup = async () => {
    console.log("Closing server and disconnecting from the database...");

    try {
      // Close the Express.js server
      server.close();
      console.log("Express.js server closed.");

      // Disconnect from the PostgreSQL database
      await disconnectFromDatabase();
    } catch (error) {
      console.error("Error during cleanup:", error);
    }

    console.log("Exiting Node.js process.");
    process.exit(0);
  };

  process.on("SIGINT", cleanup);
  process.on("exit", (code) => {
    if (code !== 0) {
      cleanup();
    }
  });
};

module.exports = gracefulShutdownService;
