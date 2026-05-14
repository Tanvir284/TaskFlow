import { useState, useEffect, useCallback } from 'react';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import FilterBar from './components/FilterBar';
import LoadingState from './components/LoadingState';
import ErrorMessage from './components/ErrorMessage';
import EmptyState from './components/EmptyState';
import * as taskService from './services/taskService';

/**
 * Root application component.
 * Owns all state, fetches tasks, and delegates UI to child components.
 */
function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // 'all' | 'pending' | 'completed'

  // ── Fetch all tasks ──────────────────────────────
  const loadTasks = useCallback(async () => {
    try {
      setError(null);
      const response = await taskService.fetchTasks();
      setTasks(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  // ── Handlers ─────────────────────────────────────

  const handleAddTask = async (taskData) => {
    try {
      const response = await taskService.createTask(taskData);
      setTasks((prev) => [response.data, ...prev]);
    } catch (err) {
      setError(err.message);
      throw err; // Re-throw so TaskForm's catch can also handle it
    }
  };

  const handleToggle = async (id) => {
    try {
      const response = await taskService.toggleTask(id);
      setTasks((prev) =>
        prev.map((task) => (task.id === id ? response.data : task))
      );
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await taskService.deleteTask(id);
      setTasks((prev) => prev.filter((task) => task.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUpdate = async (id, fields) => {
    try {
      const response = await taskService.updateTask(id, fields);
      setTasks((prev) =>
        prev.map((task) => (task.id === id ? response.data : task))
      );
    } catch (err) {
      setError(err.message);
      throw err; // Re-throw so TaskItem's catch can show inline error
    }
  };

  // ── Filter logic ─────────────────────────────────

  const filteredTasks = tasks.filter((task) => {
    if (filter === 'pending') return task.status === 'pending';
    if (filter === 'completed') return task.status === 'completed';
    return true;
  });

  const taskCounts = {
    all: tasks.length,
    pending: tasks.filter((t) => t.status === 'pending').length,
    completed: tasks.filter((t) => t.status === 'completed').length,
  };

  // ── Render ───────────────────────────────────────

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-header__title">Task-Flow</h1>
        <p className="app-header__subtitle">
          Organize your tasks, stay productive
        </p>
      </header>

      <main>
        <TaskForm onAdd={handleAddTask} />

        {error && (
          <ErrorMessage message={error} onDismiss={() => setError(null)} />
        )}

        {loading ? (
          <LoadingState />
        ) : (
          <>
            <FilterBar
              filter={filter}
              onFilterChange={setFilter}
              counts={taskCounts}
            />

            {filteredTasks.length === 0 ? (
              <EmptyState filter={filter} totalCount={tasks.length} />
            ) : (
              <TaskList
                tasks={filteredTasks}
                onToggle={handleToggle}
                onDelete={handleDelete}
                onUpdate={handleUpdate}
              />
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default App;
