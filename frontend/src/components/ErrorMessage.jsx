import { AlertTriangle, X } from 'lucide-react';

/**
 * Dismissable error banner.
 *
 * @param {{ message: string, onDismiss: () => void }} props
 */
function ErrorMessage({ message, onDismiss }) {
  return (
    <div className="error-message" role="alert">
      <span className="error-message__icon" aria-hidden="true">
        <AlertTriangle size={20} />
      </span>
      <p className="error-message__text">{message}</p>
      <button
        type="button"
        className="error-message__dismiss"
        onClick={onDismiss}
        aria-label="Dismiss error"
      >
        <X size={18} />
      </button>
    </div>
  );
}

export default ErrorMessage;
