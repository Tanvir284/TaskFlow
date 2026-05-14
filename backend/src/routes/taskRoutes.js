const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const validateTask = require('../middleware/validateTask');

// GET    /api/tasks          — Retrieve all tasks
router.get('/', taskController.getAllTasks);

// POST   /api/tasks          — Create a new task
router.post('/', validateTask, taskController.createTask);

// PUT    /api/tasks/:id      — Update a task
router.put('/:id', validateTask, taskController.updateTask);

// PATCH  /api/tasks/:id/toggle — Toggle task status
router.patch('/:id/toggle', taskController.toggleTask);

// DELETE /api/tasks/:id      — Delete a task
router.delete('/:id', taskController.deleteTask);

module.exports = router;
