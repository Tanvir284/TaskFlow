const { errorResponse } = require('../utils/apiResponse');

/**
 * Validates the request body for creating or updating a task.
 * - For POST: title is required and must be a non-empty string.
 * - For PUT: at least one valid field must be present; status must be valid if provided.
 */
function validateTask(req, res, next) {
  const { method } = req;
  const { title, description, status } = req.body;

  // POST — creating a new task
  if (method === 'POST') {
    if (!title || typeof title !== 'string' || title.trim().length === 0) {
      return errorResponse(
        res,
        'Validation failed',
        'VALIDATION_ERROR',
        400,
        'Title is required and cannot be empty.'
      );
    }

    // Sanitize: trim title
    req.body.title = title.trim();

    // Trim description if provided
    if (description !== undefined && description !== null) {
      req.body.description =
        typeof description === 'string' ? description.trim() : '';
    }

    return next();
  }

  // PUT — updating an existing task
  if (method === 'PUT') {
    const hasTitle = title !== undefined;
    const hasDescription = description !== undefined;
    const hasStatus = status !== undefined;

    // At least one updatable field must be present
    if (!hasTitle && !hasDescription && !hasStatus) {
      return errorResponse(
        res,
        'Validation failed',
        'VALIDATION_ERROR',
        400,
        'At least one field (title, description, or status) must be provided.'
      );
    }

    // If title is provided, it must be a non-empty string
    if (hasTitle) {
      if (typeof title !== 'string' || title.trim().length === 0) {
        return errorResponse(
          res,
          'Validation failed',
          'VALIDATION_ERROR',
          400,
          'Title cannot be empty.'
        );
      }
      req.body.title = title.trim();
    }

    // Trim description if provided
    if (hasDescription && typeof description === 'string') {
      req.body.description = description.trim();
    }

    // Validate status if provided
    if (hasStatus) {
      const validStatuses = ['pending', 'completed'];
      if (!validStatuses.includes(status)) {
        return errorResponse(
          res,
          'Validation failed',
          'VALIDATION_ERROR',
          400,
          `Status must be one of: ${validStatuses.join(', ')}.`
        );
      }
    }

    return next();
  }

  next();
}

module.exports = validateTask;
