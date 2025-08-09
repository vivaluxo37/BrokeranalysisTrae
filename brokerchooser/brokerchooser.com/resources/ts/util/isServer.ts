/**
 * Determine if running in server environment
 *
 * Severity level: Critical because this is used for all events
 */
export const isServer = (): boolean => typeof window === 'undefined';
