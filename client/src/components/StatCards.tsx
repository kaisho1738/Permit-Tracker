import React from 'react';
import { List, Check, Clock, AlertTriangle } from 'lucide-react';
import { FilterStatus, StatusCounts } from '../types/permit';

interface StatCardsProps {
  counts: StatusCounts;
  activeFilter: FilterStatus;
  onSelectFilter: (filter: FilterStatus) => void;
}

export const StatCards: React.FC<StatCardsProps> = ({
  counts,
  activeFilter,
  onSelectFilter,
}) => {
  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {/* Total Card */}
      <div
        onClick={() => onSelectFilter('all')}
        className={`bg-white dark:bg-surface-container border rounded-lg p-5 shadow-sm cursor-pointer transition-all hover:shadow-md ${
          activeFilter === 'all'
            ? 'border-brand-500 ring-2 ring-brand-500/20 dark:border-primary dark:ring-primary/20'
            : 'border-gray-200 dark:border-outline-variant'
        }`}
      >
        <div className="flex items-center gap-2 text-gray-500 dark:text-on-surface-variant mb-2">
          <List className="w-4 h-4" />
          <span className="text-xs font-semibold uppercase tracking-wider">Total Permits</span>
        </div>
        <div className="text-3xl font-bold text-gray-900 dark:text-on-surface">
          {counts.total}
        </div>
      </div>

      {/* Safe Card */}
      <div
        onClick={() => onSelectFilter('green')}
        className={`bg-white dark:bg-surface-container border rounded-lg p-5 shadow-sm cursor-pointer transition-all hover:shadow-md ${
          activeFilter === 'green'
            ? 'border-success-500 ring-2 ring-success-500/20 dark:border-success dark:ring-success/20'
            : 'border-gray-200 dark:border-outline-variant'
        }`}
      >
        <div className="flex items-center gap-2 text-success-500 dark:text-success mb-2">
          <Check className="w-4 h-4" />
          <span className="text-xs font-semibold text-gray-500 dark:text-on-surface-variant uppercase tracking-wider">
            Safe (6+ Months)
          </span>
        </div>
        <div className="text-3xl font-bold text-success-500 dark:text-success">
          {counts.green}
        </div>
      </div>

      {/* Expiring Soon Card */}
      <div
        onClick={() => onSelectFilter('amber')}
        className={`bg-white dark:bg-surface-container border rounded-lg p-5 shadow-sm cursor-pointer transition-all hover:shadow-md ${
          activeFilter === 'amber'
            ? 'border-warning-500 ring-2 ring-warning-500/20 dark:border-warning dark:ring-warning/20'
            : 'border-gray-200 dark:border-outline-variant'
        }`}
      >
        <div className="flex items-center gap-2 text-warning-500 dark:text-warning mb-2">
          <Clock className="w-4 h-4" />
          <span className="text-xs font-semibold text-gray-500 dark:text-on-surface-variant uppercase tracking-wider">
            Expiring (3-6 Mo.)
          </span>
        </div>
        <div className="text-3xl font-bold text-warning-500 dark:text-warning">
          {counts.amber}
        </div>
      </div>

      {/* Critical / Expired Card */}
      <div
        onClick={() => onSelectFilter('red')}
        className={`bg-white dark:bg-surface-container border rounded-lg p-5 shadow-sm cursor-pointer transition-all hover:shadow-md ${
          activeFilter === 'red'
            ? 'border-danger-500 ring-2 ring-danger-500/20 dark:border-error dark:ring-error/20'
            : 'border-gray-200 dark:border-outline-variant'
        }`}
      >
        <div className="flex items-center gap-2 text-danger-500 dark:text-error mb-2">
          <AlertTriangle className="w-4 h-4" />
          <span className="text-xs font-semibold text-gray-500 dark:text-on-surface-variant uppercase tracking-wider">
            Critical / Expired
          </span>
        </div>
        <div className="text-3xl font-bold text-danger-500 dark:text-error">
          {counts.red}
        </div>
      </div>
    </section>
  );
};
