import TaskItem from './TaskItem';

/**
 * Renders the list of task items.
 *
 * @param {{
 *   tasks: Array,
 *   onToggle: (id: number) => Promise<void>,
 *   onDelete: (id: number) => Promise<void>,
 *   onUpdate: (id: number, fields: Object) => Promise<void>
 * }} props
 */
function TaskList({ tasks, onToggle, onDelete, onUpdate }) {
  return (
    <div className="task-list" role="list" aria-label="Task list">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggle={onToggle}
          onDelete={onDelete}
          onUpdate={onUpdate}
        />
      ))}
    </div>
  );
}

export default TaskList;
