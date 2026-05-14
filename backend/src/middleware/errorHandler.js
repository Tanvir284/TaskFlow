const { errorResponse } = require('../utils/apiResponse');
const config = require('../config/env');

/**
 * Centralized error-handling middleware.
 * Catches all errors forwarded via next(err) and returns
 * a consistent JSON response. Stack traces are hidden in production.
 */
// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, _next) {
  console.error('Unhandled error:', err.message);

  if (config.nodeEnv === 'development') {
    console.error(err.stack);
  }

  return errorResponse(
    res,
    'Internal server error',
    'INTERNAL_SERVER_ERROR',
    500
  );
}

module.exports = errorHandler;
