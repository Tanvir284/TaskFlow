const Database = require('better-sqlite3');
const path = require('path');
const config = require('../config/env');

/**
 * Resolves the database path relative to the backend root directory
 * and creates a persistent SQLite connection.
 */
const dbPath = path.resolve(__dirname, '../..', config.dbPath);

const db = new Database(dbPath);

// Enable WAL mode for better concurrent read performance
db.pragma('journal_mode = WAL');
// Enable foreign keys
db.pragma('foreign_keys = ON');

module.exports = db;
