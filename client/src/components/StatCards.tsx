import React from 'react';
import { List, Check, Clock, AlertTriangle, AlertOctagon } from 'lucide-react';
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
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
      {/* Total Card */}
      <div
        onClick={() => onSelectFilter('all')}
        className={`bg-white dark:bg-slate-900 border rounded-lg p-5 shadow-sm cursor-pointer transition-all hover:shadow-md ${activeFilter === 'all'
          ? 'border-brand-500 ring-2 ring-brand-500/20 dark:border-indigo-500 dark:ring-indigo-500/20'
          : 'border-gray-200 dark:border-slate-800'
          }`}
      >
        <div className="flex items-center gap-2 text-gray-500 dark:text-slate-400 mb-2">
          <List className="w-4 h-4" />
          <span className="text-xs font-semibold uppercase tracking-wider">Total Permits</span>
        </div>
        <div className="text-3xl font-bold text-gray-900 dark:text-slate-100">
          {counts.total}
        </div>
      </div>

      {/* Safe Card */}
      <div
        onClick={() => onSelectFilter('green')}
        className={`bg-white dark:bg-slate-900 border rounded-lg p-5 shadow-sm cursor-pointer transition-all hover:shadow-md ${activeFilter === 'green'
          ? 'border-success-500 ring-2 ring-success-500/20 dark:border-emerald-500 dark:ring-emerald-500/20'
          : 'border-gray-200 dark:border-slate-800'
          }`}
      >
        <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 mb-2">
          <Check className="w-4 h-4" />
          <span className="text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">
            Safe (6+ Months)
          </span>
        </div>
        <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
          {counts.green}
        </div>
      </div>

      {/* Expiring Soon Card */}
      <div
        onClick={() => onSelectFilter('amber')}
        className={`bg-white dark:bg-slate-900 border rounded-lg p-5 shadow-sm cursor-pointer transition-all hover:shadow-md ${activeFilter === 'amber'
          ? 'border-warning-500 ring-2 ring-warning-500/20 dark:border-amber-500 dark:ring-amber-500/20'
          : 'border-gray-200 dark:border-slate-800'
          }`}
      >
        <div className="flex items-center gap-2 text-amber-500 dark:text-amber-400 mb-2">
          <Clock className="w-4 h-4" />
          <span className="text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">
            Expiring (3-6 Months)
          </span>
        </div>
        <div className="text-3xl font-bold text-amber-500 dark:text-amber-400">
          {counts.amber}
        </div>
      </div>

      {/* Critical Card */}
      <div
        onClick={() => onSelectFilter('orange')}
        className={`bg-white dark:bg-slate-900 border rounded-lg p-5 shadow-sm cursor-pointer transition-all hover:shadow-md ${activeFilter === 'orange'
          ? 'border-orange-500 ring-2 ring-orange-500/20 dark:border-orange-500 dark:ring-orange-500/20'
          : 'border-gray-200 dark:border-slate-800'
          }`}
      >
        <div className="flex items-center gap-2 text-orange-600 dark:text-orange-400 mb-2">
          <AlertTriangle className="w-4 h-4" />
          <span className="text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">
            Critical (&lt;3 Months)
          </span>
        </div>
        <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">
          {counts.orange}
        </div>
      </div>

      {/* Expired Card */}
      <div
        onClick={() => onSelectFilter('rose')}
        className={`bg-white dark:bg-slate-900 border rounded-lg p-5 shadow-sm cursor-pointer transition-all hover:shadow-md ${activeFilter === 'rose'
          ? 'border-rose-500 ring-2 ring-rose-500/20 dark:border-rose-500 dark:ring-rose-500/20'
          : 'border-gray-200 dark:border-slate-800'
          }`}
      >
        <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 mb-2">
          <AlertOctagon className="w-4 h-4" />
          <span className="text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">
            Expired
          </span>
        </div>
        <div className="text-3xl font-bold text-rose-600 dark:text-rose-400">
          {counts.rose}
        </div>
      </div>
    </section>
  );
};
