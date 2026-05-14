const db = require('./connection');

/**
 * Initializes the database schema.
 * Creates the tasks table if it does not already exist.
 * This is safe to call on every server start.
 */
function initializeDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS tasks (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      title       VARCHAR(255) NOT NULL,
      description TEXT,
      status      TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending', 'completed')),
      created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);

  console.log('Database initialized — tasks table ready');
}

module.exports = initializeDatabase;
