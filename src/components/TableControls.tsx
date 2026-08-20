import React from 'react';
import { Search } from 'lucide-react';
import { FilterStatus, StatusCounts } from '../types/permit';

interface TableControlsProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  statusFilter: FilterStatus;
  onStatusFilterChange: (filter: FilterStatus) => void;
  counts: StatusCounts;
  totalFiltered: number;
}

export const TableControls: React.FC<TableControlsProps> = ({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  counts,
  totalFiltered,
}) => {
  return (
    <div className="p-4 border-b border-gray-200 dark:border-outline-variant bg-[#fbfbfa] dark:bg-surface-container-low transition-colors">
      {/* Filter Pills */}
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        <button
          onClick={() => onStatusFilterChange('all')}
          className={`px-4 py-2 text-sm font-medium rounded-full flex items-center gap-2 transition-all cursor-pointer ${
            statusFilter === 'all'
              ? 'text-white bg-gray-900 dark:bg-on-surface dark:text-surface shadow-xs'
              : 'text-gray-700 bg-gray-100 border border-gray-200 hover:bg-gray-200 dark:text-on-surface dark:bg-surface-container dark:border-outline-variant dark:hover:bg-surface-container-high'
          }`}
        >
          <div className="w-2 h-2 rounded-full bg-current" />
          <span>All</span>
          <span className="font-mono text-xs opacity-80">{counts.total}</span>
        </button>

        <button
          onClick={() => onStatusFilterChange('red')}
          className={`px-4 py-2 text-sm font-medium rounded-full flex items-center gap-2 transition-all cursor-pointer ${
            statusFilter === 'red'
              ? 'text-white bg-gray-900 dark:bg-on-surface dark:text-surface shadow-xs'
              : 'text-gray-700 bg-gray-100 border border-gray-200 hover:bg-gray-200 dark:text-on-surface dark:bg-surface-container dark:border-outline-variant dark:hover:bg-surface-container-high'
          }`}
        >
          <div className="w-2 h-2 rounded-full bg-danger-500 dark:bg-error" />
          <span>Critical / Expired</span>
          <span className="font-mono text-xs opacity-80">{counts.red}</span>
        </button>

        <button
          onClick={() => onStatusFilterChange('amber')}
          className={`px-4 py-2 text-sm font-medium rounded-full flex items-center gap-2 transition-all cursor-pointer ${
            statusFilter === 'amber'
              ? 'text-white bg-gray-900 dark:bg-on-surface dark:text-surface shadow-xs'
              : 'text-gray-700 bg-gray-100 border border-gray-200 hover:bg-gray-200 dark:text-on-surface dark:bg-surface-container dark:border-outline-variant dark:hover:bg-surface-container-high'
          }`}
        >
          <div className="w-2 h-2 rounded-full bg-warning-500 dark:bg-warning" />
          <span>Expiring Soon</span>
          <span className="font-mono text-xs opacity-80">{counts.amber}</span>
        </button>

        <button
          onClick={() => onStatusFilterChange('green')}
          className={`px-4 py-2 text-sm font-medium rounded-full flex items-center gap-2 transition-all cursor-pointer ${
            statusFilter === 'green'
              ? 'text-white bg-gray-900 dark:bg-on-surface dark:text-surface shadow-xs'
              : 'text-gray-700 bg-gray-100 border border-gray-200 hover:bg-gray-200 dark:text-on-surface dark:bg-surface-container dark:border-outline-variant dark:hover:bg-surface-container-high'
          }`}
        >
          <div className="w-2 h-2 rounded-full bg-success-500 dark:bg-success" />
          <span>Safe</span>
          <span className="font-mono text-xs opacity-80">{counts.green}</span>
        </button>
      </div>

      {/* Search Input & Counter */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="relative w-full max-w-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 dark:text-on-surface-variant">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search powerplant, permit, law..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-outline-variant rounded-md leading-5 bg-white dark:bg-surface-container text-gray-900 dark:text-on-surface placeholder-gray-500 dark:placeholder-on-surface-variant focus:outline-none focus:ring-1 focus:ring-brand-500 dark:focus:ring-primary focus:border-brand-500 dark:focus:border-primary sm:text-sm transition-colors"
          />
        </div>
        <div className="text-sm text-gray-500 dark:text-on-surface-variant font-mono">
          {totalFiltered !== counts.total
            ? `${totalFiltered} of ${counts.total} permits`
            : `${counts.total} permits`}
        </div>
      </div>
    </div>
  );
};
