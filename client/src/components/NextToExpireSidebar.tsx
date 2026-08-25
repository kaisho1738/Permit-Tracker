import React from 'react';
import { Permit, FilterStatus } from '../types/permit';
import { getStatus, getStatusMeta, formatDateDisplay } from '../utils/dateUtils';
import { Clock } from 'lucide-react';

interface NextToExpireSidebarProps {
  upcomingPermits: Array<{ permit: Permit; months: number | null }>;
  onSelectFilter: (filter: FilterStatus) => void;
}

export const NextToExpireSidebar: React.FC<NextToExpireSidebarProps> = ({
  upcomingPermits,
  onSelectFilter,
}) => {
  return (
    <aside className="w-full lg:w-80 bg-[#fffaf5] dark:bg-slate-900 border border-[#f3e8d9] dark:border-slate-800 rounded-lg p-5 shadow-sm h-fit transition-colors shrink-0">
      <h3 className="text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-4 flex items-center justify-between">
        <span>Next to Expire</span>
        <Clock className="w-3.5 h-3.5 text-gray-400 dark:text-slate-500" />
      </h3>

      <ul className="space-y-4">
        {upcomingPermits.length === 0 ? (
          <li className="text-xs text-gray-400 dark:text-slate-500 py-2">
            No permits with expiry dates.
          </li>
        ) : (
          upcomingPermits.map(({ permit, months }) => {
            const status = getStatus(months);
            const meta = getStatusMeta(status);
            const dateStr = formatDateDisplay(permit.expiry);

            return (
              <li
                key={permit.id}
                onClick={() => onSelectFilter(status as FilterStatus)}
                title={`Filter by ${meta.label}`}
                className="flex justify-between items-start border-b border-gray-100 dark:border-slate-800/80 pb-3 last:border-0 hover:bg-black/5 dark:hover:bg-slate-800/50 p-1.5 rounded cursor-pointer transition-colors"
              >
                <div className="overflow-hidden pr-2">
                  <div className="text-sm font-semibold text-gray-900 dark:text-slate-100 truncate">
                    {permit.plant || 'Untitled permit'}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">
                    {permit.permit || ''} • {dateStr}
                  </div>
                </div>
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border shrink-0 ${meta.badgeClass}`}
                >
                  {meta.label.replace(' / Expired', '')}
                </span>
              </li>
            );
          })
        )}
      </ul>
    </aside>
  );
};
