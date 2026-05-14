const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

/**
 * Centralized environment configuration.
 * All env variables are read once here and exported for use across the app.
 */
const config = {
  port: parseInt(process.env.PORT, 10) || 5000,
  dbPath: process.env.DB_PATH || './taskflow.db',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  nodeEnv: process.env.NODE_ENV || 'development',
};

module.exports = config;
