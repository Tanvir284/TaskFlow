const express = require('express');
const cors = require('cors');
const config = require('./config/env');
const taskRoutes = require('./routes/taskRoutes');
const notFound = require('./middleware/notFound');
const errorHandler = require('./middleware/errorHandler');

/**
 * Creates and configures the Express application.
 * Exported separately from server.js so tests can import the app
 * without starting the HTTP listener.
 */
const app = express();

// ── Middleware ──────────────────────────────────────────────
app.use(cors({ origin: config.corsOrigin }));
app.use(express.json());

// ── Routes ─────────────────────────────────────────────────
app.use('/api/tasks', taskRoutes);

// ── Fallback handlers ──────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

module.exports = app;
