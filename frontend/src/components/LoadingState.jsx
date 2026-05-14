/**
 * Full-width loading spinner shown while tasks are being fetched.
 */
function LoadingState() {
  return (
    <div className="loading-state" role="status" aria-label="Loading tasks">
      <div className="loading-state__spinner" aria-hidden="true" />
      <p className="loading-state__text">Loading tasks…</p>
    </div>
  );
}

export default LoadingState;
