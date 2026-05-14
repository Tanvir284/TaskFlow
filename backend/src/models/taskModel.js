const db = require('../db/connection');

/**
 * Task Model — Data access layer for the tasks table.
 * All SQL uses parameterized queries to prevent injection.
 */

/**
 * Retrieve all tasks ordered by creation date (newest first).
 * @returns {Array<Object>}
 */
function getAllTasks() {
  const stmt = db.prepare('SELECT * FROM tasks ORDER BY created_at DESC');
  return stmt.all();
}

/**
 * Retrieve a single task by its ID.
 * @param {number} id
 * @returns {Object|undefined}
 */
function getTaskById(id) {
  const stmt = db.prepare('SELECT * FROM tasks WHERE id = ?');
  return stmt.get(id);
}

/**
 * Create a new task.
 * @param {string} title
 * @param {string|null} description
 * @returns {Object} The newly created task
 */
function createTask(title, description = null) {
  const stmt = db.prepare(
    'INSERT INTO tasks (title, description) VALUES (?, ?)'
  );
  const result = stmt.run(title, description || null);
  return getTaskById(result.lastInsertRowid);
}

/**
 * Update an existing task's title, description, and/or status.
 * Only provided fields are updated; others remain unchanged.
 * @param {number} id
 * @param {Object} fields - { title?, description?, status? }
 * @returns {Object|null} The updated task, or null if not found
 */
function updateTask(id, fields) {
  const task = getTaskById(id);
  if (!task) return null;

  const updatedTitle = fields.title !== undefined ? fields.title : task.title;
  const updatedDescription =
    fields.description !== undefined ? fields.description : task.description;
  const updatedStatus =
    fields.status !== undefined ? fields.status : task.status;

  const stmt = db.prepare(
    `UPDATE tasks
     SET title = ?, description = ?, status = ?, updated_at = CURRENT_TIMESTAMP
     WHERE id = ?`
  );
  stmt.run(updatedTitle, updatedDescription, updatedStatus, id);

  return getTaskById(id);
}

/**
 * Toggle a task's status between 'pending' and 'completed'.
 * @param {number} id
 * @returns {Object|null} The updated task, or null if not found
 */
function toggleTaskStatus(id) {
  const task = getTaskById(id);
  if (!task) return null;

  const newStatus = task.status === 'pending' ? 'completed' : 'pending';

  const stmt = db.prepare(
    `UPDATE tasks SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`
  );
  stmt.run(newStatus, id);

  return getTaskById(id);
}

/**
 * Delete a task by ID.
 * @param {number} id
 * @returns {boolean} True if a row was deleted, false if not found
 */
function deleteTask(id) {
  const stmt = db.prepare('DELETE FROM tasks WHERE id = ?');
  const result = stmt.run(id);
  return result.changes > 0;
}

module.exports = {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  toggleTaskStatus,
  deleteTask,
};
