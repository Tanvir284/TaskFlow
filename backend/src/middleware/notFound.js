const { errorResponse } = require('../utils/apiResponse');

/**
 * Catch-all middleware for routes that don't match any defined endpoint.
 * Returns a 404 JSON response instead of Express's default HTML.
 */
function notFound(req, res) {
  return errorResponse(
    res,
    `Route not found: ${req.method} ${req.originalUrl}`,
    'NOT_FOUND',
    404
  );
}

module.exports = notFound;
