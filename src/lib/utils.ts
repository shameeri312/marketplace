import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Add locale-specific formatting rules
TimeAgo.addLocale(en);

/**
 * Formats a given date into a relative time string.
 *
 * @param {Date} date The date to format.
 * @returns {string} The formatted relative time string (e.g., "a minute ago", "2 days ago").
 */
export const formatRelativeTime = (date: Date) => {
  // Create a TimeAgo instance with the desired locale (en-US in this case)
  const timeAgo = new TimeAgo('en-US');

  // Format the date into a relative time string
  return timeAgo.format(date);
};
