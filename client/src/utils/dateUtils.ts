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
  if (months < 0) return 'rose';
  if (months < 3) return 'orange';
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
        badgeClass: 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-400 dark:border-emerald-800/80',
        dotClass: 'bg-emerald-600 dark:bg-emerald-400',
      };
    case 'amber':
      return {
        label: 'Expiring Soon',
        code: '[YELLOW]',
        badgeClass: 'bg-amber-50 text-amber-500 border-amber-200 dark:bg-amber-950/60 dark:text-amber-400 dark:border-amber-800/80',
        dotClass: 'bg-amber-500 dark:bg-amber-400',
      };
    case 'orange':
      return {
        label: 'Critical (< 3 Months)',
        code: '[ORANGE]',
        badgeClass: 'bg-orange-50 text-orange-600 border-orange-200 dark:bg-orange-950/60 dark:text-orange-400 dark:border-orange-800/80',
        dotClass: 'bg-orange-600 dark:bg-orange-400',
      };
    case 'rose':
      return {
        label: 'Expired',
        code: '[RED]',
        badgeClass: 'bg-rose-50 text-rose-600 border-rose-200 dark:bg-rose-950/60 dark:text-rose-400 dark:border-rose-800/80',
        dotClass: 'bg-rose-600 dark:bg-rose-400',
      };
    case 'gray':
    default:
      return {
        label: 'No Date',
        code: '[GRAY]',
        badgeClass: 'bg-muted text-muted-foreground border-border',
        dotClass: 'bg-muted-foreground',
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
