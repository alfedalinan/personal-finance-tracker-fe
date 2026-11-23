/**
 * Formats an ISO 8601 date string into a standard medium date format in the user's local timezone.
 * Example: "2026-11-23T01:00:00Z" -> "Nov 22, 2026" (depending on local timezone)
 * Returns "--" if the date is invalid or missing.
 */
export function formatTransactionDate(dateString?: string | null): string {
  if (!dateString) {
    return '--';
  }

  try {
    let normalized = dateString.trim();
    normalized = normalized.replace(/\.(\d{3})\d+/, '.$1');
    if (normalized.includes('T')) {
      const tIndex = normalized.indexOf('T');
      const timePart = normalized.slice(tIndex + 1);
      const hasTimezone = timePart.includes('Z') || timePart.includes('+') || timePart.includes('-');
      if (!hasTimezone) {
        normalized += 'Z';
      }
    }

    const date = new Date(normalized);
    if (isNaN(date.getTime())) {
      return '--';
    }

    return new Intl.DateTimeFormat(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }).format(date);
  } catch {
    return '--';
  }
}
