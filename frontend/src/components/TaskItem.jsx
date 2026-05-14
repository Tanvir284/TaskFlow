import { useState, useEffect } from 'react';
import { Check, Pencil, Trash2, AlertCircle } from 'lucide-react';
import { formatDate } from '../utils/formatDate';

/**
 * Individual task card with view mode and inline edit mode.
 * Supports toggling status, editing, and deleting with confirmation.
 *
 * @param {{
 *   task: Object,
 *   onToggle: (id: number) => Promise<void>,
 *   onDelete: (id: number) => Promise<void>,
 *   onUpdate: (id: number, fields: Object) => Promise<void>
 * }} props
 */
function TaskItem({ task, onToggle, onDelete, onUpdate }) {
  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDescription, setEditDescription] = useState(
    task.description || ''
  );
  const [editError, setEditError] = useState('');
  const [saving, setSaving] = useState(false);

  const isCompleted = task.status === 'completed';

  // Sync edit fields if the task prop changes (e.g. toggled externally)
  useEffect(() => {
    if (!editing) {
      setEditTitle(task.title);
      setEditDescription(task.description || '');
    }
  }, [task.title, task.description, editing]);

  // ── Toggle ──────────────────────────────────
  const handleToggle = async () => {
    try {
      await onToggle(task.id);
    } catch (err) {
      // Error is handled at the App level via setError
      console.error('Toggle failed:', err.message);
    }
  };

  // ── Delete with confirmation ────────────────
  const handleDelete = async () => {
    const confirmed = window.confirm(
      `Delete task "${task.title}"? This action cannot be undone.`
    );
    if (!confirmed) return;

    try {
      await onDelete(task.id);
    } catch (err) {
      // Error is handled at the App level via setError
      console.error('Delete failed:', err.message);
    }
  };

  // ── Edit mode ───────────────────────────────
  const startEditing = () => {
    setEditTitle(task.title);
    setEditDescription(task.description || '');
    setEditError('');
    setEditing(true);
  };

  const cancelEditing = () => {
    setEditing(false);
    setEditError('');
  };

  const handleSave = async () => {
    const trimmedTitle = editTitle.trim();
    if (!trimmedTitle) {
      setEditError('Title cannot be empty.');
      return;
    }

    setEditError('');
    setSaving(true);

    try {
      await onUpdate(task.id, {
        title: trimmedTitle,
        description: editDescription.trim(),
      });
      setEditing(false);
    } catch (err) {
      setEditError(err.message || 'Failed to save changes.');
    } finally {
      setSaving(false);
    }
  };

  const handleEditKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    }
    if (e.key === 'Escape') {
      cancelEditing();
    }
  };

  // ── Edit mode render ────────────────────────
  if (editing) {
    return (
      <div className="task-item" role="listitem">
        <div className="task-edit">
          <div className="task-edit__group">
            <input
              type="text"
              className={`task-edit__input ${editError ? 'task-edit__input--error' : ''}`}
              value={editTitle}
              onChange={(e) => {
                setEditTitle(e.target.value);
                if (editError) setEditError('');
              }}
              onKeyDown={handleEditKeyDown}
              placeholder="Task title"
              maxLength={255}
              autoFocus
              aria-label="Edit task title"
            />
            {editError && (
              <p className="task-edit__error" role="alert">
                <AlertCircle size={14} /> {editError}
              </p>
            )}
          </div>
          <div className="task-edit__group">
            <textarea
              className="task-edit__textarea"
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              onKeyDown={handleEditKeyDown}
              placeholder="Description (optional)"
              rows={2}
              aria-label="Edit task description"
            />
          </div>
          <div className="task-edit__actions">
            <button
              type="button"
              className="btn btn--primary btn--sm"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? 'Saving…' : 'Save'}
            </button>
            <button
              type="button"
              className="btn btn--secondary btn--sm"
              onClick={cancelEditing}
              disabled={saving}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── View mode render ────────────────────────
  return (
    <div
      className={`task-item ${isCompleted ? 'task-item--completed' : ''}`}
      role="listitem"
    >
      {/* Checkbox toggle */}
      <button
        type="button"
        className={`task-item__checkbox ${isCompleted ? 'task-item__checkbox--checked' : ''}`}
        onClick={handleToggle}
        aria-label={
          isCompleted ? 'Mark as pending' : 'Mark as completed'
        }
        title={isCompleted ? 'Mark as pending' : 'Mark as completed'}
      >
        {isCompleted && <Check size={14} strokeWidth={3} />}
      </button>

      {/* Content */}
      <div className="task-item__content">
        <p className="task-item__title">{task.title}</p>
        {task.description && (
          <p className="task-item__description">{task.description}</p>
        )}
        <div className="task-item__meta">
          <span
            className={`task-item__badge task-item__badge--${task.status}`}
          >
            {task.status}
          </span>
          <span className="task-item__date">
            {formatDate(task.created_at)}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="task-item__actions">
        <button
          type="button"
          className="btn btn--secondary btn--sm"
          onClick={startEditing}
          aria-label={`Edit task: ${task.title}`}
        >
          <Pencil size={14} /> Edit
        </button>
        <button
          type="button"
          className="btn btn--danger btn--sm"
          onClick={handleDelete}
          aria-label={`Delete task: ${task.title}`}
        >
          <Trash2 size={14} /> Delete
        </button>
      </div>
    </div>
  );
}

export default TaskItem;
