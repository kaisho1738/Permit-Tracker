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
    <aside className="w-full lg:w-80 bg-[#fffaf5] dark:bg-surface-container border border-[#f3e8d9] dark:border-outline-variant rounded-lg p-5 shadow-sm h-fit transition-colors shrink-0">
      <h3 className="text-xs font-semibold text-gray-500 dark:text-on-surface-variant uppercase tracking-wider mb-4 flex items-center justify-between">
        <span>Next to Expire</span>
        <Clock className="w-3.5 h-3.5 text-gray-400" />
      </h3>

      <ul className="space-y-4">
        {upcomingPermits.length === 0 ? (
          <li className="text-xs text-gray-400 dark:text-on-surface-variant py-2">
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
                className="flex justify-between items-start border-b border-gray-100 dark:border-outline-variant pb-3 last:border-0 hover:bg-black/5 dark:hover:bg-white/5 p-1.5 rounded cursor-pointer transition-colors"
              >
                <div className="overflow-hidden pr-2">
                  <div className="text-sm font-semibold text-gray-900 dark:text-on-surface truncate">
                    {permit.plant || 'Untitled permit'}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-on-surface-variant mt-0.5">
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
