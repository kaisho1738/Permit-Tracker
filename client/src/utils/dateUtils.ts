import { StatusType } from '../types/permit';

/**
 * Calculates the month difference between the current date and the given expiry date string.
 */
export function getMonthsDiff(expiryDateStr: string): number | null {
  if (!expiryDateStr) return null;
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const exp = new Date(expiryDateStr);
  if (isNaN(exp.getTime())) return null;

  return (exp.getTime() - now.getTime()) / (1000 * 60 * 60 * 24 * 30.4375);
}

/**
 * Derives the permit status based on remaining months.
 */
export function getStatus(months: number | null): StatusType {
  if (months == null) return 'gray';
  if (months < 0) return 'red';
  if (months < 3) return 'red';
  if (months < 6) return 'amber';
  return 'green';
}

/**
 * Generates automated remarks based on months difference.
 */
export function getRemarks(months: number | null): string {
  if (months == null) return 'Set a date';

  const totalDays = Math.round(Math.abs(months) * 30.4375);

  if (months < 0) {
    return `Expired ${totalDays} day${totalDays !== 1 ? 's' : ''} ago`;
  }

  const m = Math.floor(months);
  const d = totalDays - m * 30;

  if (m === 0) return `Expiring in ${totalDays} day${totalDays !== 1 ? 's' : ''}`;
  if (d <= 0) return `Expiring in ${m} month${m !== 1 ? 's' : ''}`;
  return `Expiring in ${m} mo. ${d} day${d !== 1 ? 's' : ''}`;
}

export interface StatusMetadata {
  label: string;
  code: string;
  badgeClass: string;
  dotClass: string;
}

export function getStatusMeta(status: StatusType): StatusMetadata {
  switch (status) {
    case 'green':
      return {
        label: 'Safe',
        code: '[GREEN]',
        badgeClass: 'bg-success-50 text-success-500 border-success-200 dark:bg-success/20 dark:text-success dark:border-success/30',
        dotClass: 'bg-success-500 dark:bg-success',
      };
    case 'amber':
      return {
        label: 'Expiring Soon',
        code: '[ORANGE]',
        badgeClass: 'bg-warning-50 text-warning-600 border-warning-200 dark:bg-warning/20 dark:text-warning dark:border-warning/30',
        dotClass: 'bg-warning-500 dark:bg-warning',
      };
    case 'red':
      return {
        label: 'Critical / Expired',
        code: '[RED]',
        badgeClass: 'bg-danger-50 text-danger-500 border-danger-200 dark:bg-error/20 dark:text-error dark:border-error/30',
        dotClass: 'bg-danger-500 dark:bg-error',
      };
    case 'gray':
    default:
      return {
        label: 'No Date',
        code: '[GRAY]',
        badgeClass: 'bg-gray-100 text-gray-500 border-gray-200 dark:bg-surface-container-highest dark:text-on-surface-variant dark:border-outline-variant',
        dotClass: 'bg-gray-400 dark:bg-on-surface-variant',
      };
  }
}

/**
 * Formats YYYY-MM-DD into "12 Oct 2026".
 */
export function formatDateDisplay(dateStr: string): string {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  const day = String(d.getDate()).padStart(2, '0');
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const month = months[d.getMonth()];
  const year = d.getFullYear();
  return `${day} ${month} ${year}`;
}
