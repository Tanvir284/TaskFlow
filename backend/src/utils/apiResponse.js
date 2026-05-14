/**
 * Standardized API response helpers.
 * Every response from the backend uses one of these shapes
 * to ensure consistency for the frontend consumer.
 */

/**
 * Send a success response.
 * @param {import('express').Response} res
 * @param {string} message
 * @param {*} data
 * @param {number} statusCode
 */
function successResponse(res, message, data = null, statusCode = 200) {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
}

/**
 * Send an error response.
 * @param {import('express').Response} res
 * @param {string} message
 * @param {string} code - error code enum
 * @param {number} statusCode
 * @param {*} details - optional additional error details
 */
function errorResponse(res, message, code, statusCode = 400, details = null) {
  const body = {
    success: false,
    message,
    error: { code },
  };

  if (details) {
    body.error.details = details;
  }

  return res.status(statusCode).json(body);
}

module.exports = { successResponse, errorResponse };
