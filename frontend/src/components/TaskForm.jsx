import { useState } from 'react';
import { Plus, AlertCircle } from 'lucide-react';

/**
 * Controlled form for creating a new task.
 * Validates title on the frontend before submitting.
 *
 * @param {{ onAdd: (data: { title: string, description: string }) => Promise<void> }} props
 */
function TaskForm({ onAdd }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Frontend validation
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setError('Title is required.');
      return;
    }

    setError('');
    setSubmitting(true);

    try {
      await onAdd({
        title: trimmedTitle,
        description: description.trim() || undefined,
      });
      // Reset form on success
      setTitle('');
      setDescription('');
    } catch (err) {
      setError(err.message || 'Failed to add task.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="task-form" onSubmit={handleSubmit} noValidate>
      <div className="task-form__group">
        <label htmlFor="task-title" className="task-form__label">
          Title <span aria-hidden="true">*</span>
        </label>
        <input
          id="task-title"
          type="text"
          className={`task-form__input ${error ? 'task-form__input--error' : ''}`}
          placeholder="What needs to be done?"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            if (error) setError('');
          }}
          maxLength={255}
          aria-required="true"
          aria-invalid={!!error}
          aria-describedby={error ? 'task-title-error' : undefined}
        />
        {error && (
          <p id="task-title-error" className="task-form__error" role="alert">
            <AlertCircle size={14} /> {error}
          </p>
        )}
      </div>

      <div className="task-form__group">
        <label htmlFor="task-description" className="task-form__label">
          Description <span style={{ fontWeight: 400 }}>(optional)</span>
        </label>
        <textarea
          id="task-description"
          className="task-form__textarea"
          placeholder="Add some details…"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={2}
        />
      </div>

      <div className="task-form__actions">
        <button
          type="submit"
          className="btn btn--primary"
          disabled={submitting}
        >
          {submitting ? 'Adding…' : <><Plus size={16} /> Add Task</>}
        </button>
      </div>
    </form>
  );
}

export default TaskForm;
