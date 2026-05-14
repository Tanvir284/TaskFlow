const config = require('./config/env');
const initializeDatabase = require('./db/init');
const app = require('./app');

/**
 * Entry point — initializes the database, then starts the HTTP server.
 */
initializeDatabase();

app.listen(config.port, () => {
  console.log(`Task-Flow API running at http://localhost:${config.port}`);
  console.log(`   Environment: ${config.nodeEnv}`);
});
