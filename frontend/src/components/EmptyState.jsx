import { ListTodo, PartyPopper, ClipboardCheck } from 'lucide-react';

/**
 * Shown when the task list is empty.
 * Message adapts based on the current filter.
 *
 * @param {{ filter: string, totalCount: number }} props
 */
function EmptyState({ filter, totalCount }) {
  const messages = {
    all: {
      icon: <ListTodo size={48} strokeWidth={1.5} />,
      title: 'No tasks yet',
      message: 'Add your first task above to get started!',
    },
    pending: {
      icon: <PartyPopper size={48} strokeWidth={1.5} />,
      title: 'All caught up!',
      message: 'No pending tasks — great job!',
    },
    completed: {
      icon: <ClipboardCheck size={48} strokeWidth={1.5} />,
      title: 'Nothing completed yet',
      message:
        totalCount > 0
          ? 'Complete a task to see it here.'
          : 'Add some tasks and start checking them off.',
    },
  };

  const { icon, title, message } = messages[filter] || messages.all;

  return (
    <div className="empty-state" role="status">
      <div className="empty-state__icon" aria-hidden="true">
        {icon}
      </div>
      <h2 className="empty-state__title">{title}</h2>
      <p className="empty-state__message">{message}</p>
    </div>
  );
}

export default EmptyState;
