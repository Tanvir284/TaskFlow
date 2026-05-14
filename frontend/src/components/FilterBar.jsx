/**
 * Filter bar with All / Pending / Completed buttons
 * and a task count indicator.
 *
 * @param {{
 *   filter: string,
 *   onFilterChange: (filter: string) => void,
 *   counts: { all: number, pending: number, completed: number }
 * }} props
 */
function FilterBar({ filter, onFilterChange, counts }) {
  const filters = [
    { key: 'all', label: 'All' },
    { key: 'pending', label: 'Pending' },
    { key: 'completed', label: 'Completed' },
  ];

  return (
    <div className="filter-bar" role="group" aria-label="Filter tasks">
      <span className="filter-bar__label">Filter:</span>
      {filters.map(({ key, label }) => (
        <button
          key={key}
          type="button"
          className={`filter-bar__btn ${filter === key ? 'filter-bar__btn--active' : ''}`}
          onClick={() => onFilterChange(key)}
          aria-pressed={filter === key}
        >
          {label} ({counts[key]})
        </button>
      ))}
      <span className="filter-bar__count">
        Showing {counts[filter]} of {counts.all} task{counts.all !== 1 ? 's' : ''}
      </span>
    </div>
  );
}

export default FilterBar;
