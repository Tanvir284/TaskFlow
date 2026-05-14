const taskModel = require('../models/taskModel');
const { successResponse, errorResponse } = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');

/**
 * @route   GET /api/tasks
 * @desc    Retrieve all tasks
 */
const getAllTasks = asyncHandler(async (req, res) => {
  const tasks = taskModel.getAllTasks();
  return successResponse(res, 'Tasks retrieved successfully', tasks);
});

/**
 * @route   POST /api/tasks
 * @desc    Create a new task
 */
const createTask = asyncHandler(async (req, res) => {
  const { title, description } = req.body;
  const task = taskModel.createTask(title, description);
  return successResponse(res, 'Task created successfully', task, 201);
});

/**
 * @route   PUT /api/tasks/:id
 * @desc    Update a task's title, description, or status
 */
const updateTask = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, description, status } = req.body;

  const task = taskModel.updateTask(Number(id), { title, description, status });

  if (!task) {
    return errorResponse(res, 'Task not found', 'NOT_FOUND', 404);
  }

  return successResponse(res, 'Task updated successfully', task);
});

/**
 * @route   PATCH /api/tasks/:id/toggle
 * @desc    Toggle a task's status between pending and completed
 */
const toggleTask = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const task = taskModel.toggleTaskStatus(Number(id));

  if (!task) {
    return errorResponse(res, 'Task not found', 'NOT_FOUND', 404);
  }

  return successResponse(res, 'Task status toggled successfully', task);
});

/**
 * @route   DELETE /api/tasks/:id
 * @desc    Delete a task by ID
 */
const deleteTask = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const deleted = taskModel.deleteTask(Number(id));

  if (!deleted) {
    return errorResponse(res, 'Task not found', 'NOT_FOUND', 404);
  }

  return successResponse(res, 'Task deleted successfully');
});

module.exports = {
  getAllTasks,
  createTask,
  updateTask,
  toggleTask,
  deleteTask,
};
