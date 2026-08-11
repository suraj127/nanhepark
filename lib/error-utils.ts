/**
 * Helper to safely format any error (including Event objects, strings, Error instances)
 * into a clear, human-readable string to prevent '[object Event]' crashes.
 */
export function formatErrorMessage(err: unknown, defaultMessage = 'An unexpected error occurred.'): string {
  if (!err) return defaultMessage;

  if (err instanceof Error && err.message) {
    return err.message;
  }

  if (typeof err === 'string' && err.trim().length > 0) {
    return err;
  }

  if (typeof err === 'object') {
    const obj = err as any;
    if (typeof obj.message === 'string' && obj.message.trim().length > 0) {
      return obj.message;
    }
    if (typeof obj.error === 'string' && obj.error.trim().length > 0) {
      return obj.error;
    }
    if (typeof obj.statusText === 'string' && obj.statusText.trim().length > 0) {
      return obj.statusText;
    }
  }

  return defaultMessage;
}
