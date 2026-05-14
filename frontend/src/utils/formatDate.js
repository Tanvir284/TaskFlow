/**
 * Formats an ISO/SQLite date string into a human-readable format.
 * Example: "2024-01-15 09:30:00" → "Jan 15, 2024"
 *
 * @param {string} dateString - Date string from the database
 * @returns {string} Formatted date
 */
export function formatDate(dateString) {
  if (!dateString) return '';

  const date = new Date(dateString);

  // Guard against invalid dates
  if (isNaN(date.getTime())) return dateString;

  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}
