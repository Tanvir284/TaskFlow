const API_BASE = '/api/tasks';

/**
 * Centralized API service for all task-related HTTP calls.
 * Each function returns parsed JSON or throws an error with a message.
 */

async function handleResponse(response) {
  // Safely attempt to parse JSON; handle non-JSON or empty responses
  let data;
  try {
    const text = await response.text();
    data = text ? JSON.parse(text) : {};
  } catch {
    // Response body is not valid JSON (e.g. HTML error page, empty)
    if (!response.ok) {
      throw new Error(`Server error: ${response.status} ${response.statusText}`);
    }
    return {};
  }

  if (!response.ok) {
    const message =
      data?.error?.details || data?.message || 'An unexpected error occurred';
    throw new Error(message);
  }

  return data;
}

/**
 * Fetch all tasks.
 * @returns {Promise<Object>}
 */
export async function fetchTasks() {
  const response = await fetch(API_BASE);
  return handleResponse(response);
}

/**
 * Create a new task.
 * @param {{ title: string, description?: string }} taskData
 * @returns {Promise<Object>}
 */
export async function createTask(taskData) {
  const response = await fetch(API_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(taskData),
  });
  return handleResponse(response);
}

/**
 * Update an existing task.
 * @param {number} id
 * @param {{ title?: string, description?: string, status?: string }} fields
 * @returns {Promise<Object>}
 */
export async function updateTask(id, fields) {
  const response = await fetch(`${API_BASE}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(fields),
  });
  return handleResponse(response);
}

/**
 * Toggle a task's status.
 * @param {number} id
 * @returns {Promise<Object>}
 */
export async function toggleTask(id) {
  const response = await fetch(`${API_BASE}/${id}/toggle`, {
    method: 'PATCH',
  });
  return handleResponse(response);
}

/**
 * Delete a task.
 * @param {number} id
 * @returns {Promise<Object>}
 */
export async function deleteTask(id) {
  const response = await fetch(`${API_BASE}/${id}`, {
    method: 'DELETE',
  });
  return handleResponse(response);
}
