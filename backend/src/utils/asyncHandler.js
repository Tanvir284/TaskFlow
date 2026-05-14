/**
 * Wraps an async route handler so that rejected promises
 * are automatically forwarded to Express error middleware.
 *
 * Usage: router.get('/path', asyncHandler(async (req, res) => { ... }));
 *
 * @param {Function} fn - Async Express route handler
 * @returns {Function} Express middleware
 */
function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

module.exports = asyncHandler;
