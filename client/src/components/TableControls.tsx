import React from 'react';
import { Search, SlidersHorizontal, LayoutGrid, TableProperties, Trash2, Loader2 } from 'lucide-react';
import { FilterStatus, StatusCounts, SortField, SortDirection } from '../types/permit';

interface TableControlsProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  statusFilter?: FilterStatus;
  onStatusFilterChange?: (filter: FilterStatus) => void;
  sortField: SortField;
  sortDir: SortDirection;
  onOpenSortModal: () => void;
  counts: StatusCounts;
  totalFiltered: number;
  viewMode: 'table' | 'cards';
  onViewModeChange: (mode: 'table' | 'cards') => void;
  selectedCount?: number;
  onBatchDelete?: () => void;
  isDeletingBatch?: boolean;
}

const SORT_LABELS: Record<SortField, { name: string; asc: string; desc: string }> = {
  plant: { name: 'Company', asc: 'A–Z', desc: 'Z–A' },
  permit: { name: 'Permit Name', asc: 'A–Z', desc: 'Z–A' },
  expiry: { name: 'Expiry Date', asc: 'Earliest', desc: 'Latest' },
  date_issued: { name: 'Date Issued', asc: 'Oldest', desc: 'Newest' },
  environmental_law: { name: 'Environmental Law', asc: 'A–Z', desc: 'Z–A' },
};

export const TableControls: React.FC<TableControlsProps> = ({
  searchQuery,
  onSearchChange,
  sortField,
  sortDir,
  onOpenSortModal,
  counts,
  totalFiltered,
  viewMode,
  onViewModeChange,
  selectedCount,
  onBatchDelete,
  isDeletingBatch,
}) => {
  const currentSort = SORT_LABELS[sortField] || SORT_LABELS.expiry;
  const currentDirLabel = sortDir === 'asc' ? currentSort.asc : currentSort.desc;

  return (
    <div className="p-3 sm:p-4 border-b border-border bg-card text-card-foreground transition-colors">
      {/* Search Input, Sort Modal Button, View Mode Toggle & Counter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3">
        <div className="flex items-center gap-2 sm:gap-3 flex-1 max-w-2xl">
          {/* Search Bar */}
          <div className="relative flex-1 min-w-0">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search company, permit, law..."
              className="block w-full pl-9 sm:pl-10 pr-3 py-2 border border-input rounded-lg leading-5 bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/20 focus:border-primary text-xs sm:text-sm transition-colors"
            />
          </div>

          {/* Sort Modal Button Beside Search Bar */}
          <button
            type="button"
            onClick={onOpenSortModal}
            className="flex items-center justify-center gap-1.5 sm:gap-2 bg-card border border-input hover:bg-muted text-foreground rounded-lg p-2 sm:px-3 sm:py-2 shrink-0 shadow-2xs transition-colors cursor-pointer text-xs sm:text-sm font-medium"
            title="Open Sort Settings"
            aria-label="Open Sort Settings"
          >
            <SlidersHorizontal className="w-4 h-4 text-primary shrink-0" />
            <div className="hidden sm:flex items-center gap-1">
              <span className="text-muted-foreground">Sort:</span>
              <span className="font-semibold text-foreground truncate max-w-[90px] md:max-w-none">
                {currentSort.name}
              </span>
              <span className="text-[11px] sm:text-xs text-primary font-mono bg-accent px-1.5 py-0.5 rounded">
                {currentDirLabel}
              </span>
            </div>
          </button>

          {/* View Mode Toggle: Cards vs Table */}
          <div className="flex items-center bg-muted p-0.5 rounded-lg border border-input shrink-0">
            <button
              type="button"
              onClick={() => onViewModeChange('cards')}
              className={`p-1.5 rounded-md text-xs font-medium flex items-center gap-1 transition-all cursor-pointer ${
                viewMode === 'cards'
                  ? 'bg-card text-foreground shadow-2xs font-semibold'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              title="Cards View"
              aria-label="Cards View"
            >
              <LayoutGrid className="w-4 h-4" />
              <span className="hidden md:inline text-xs">Cards</span>
            </button>
            <button
              type="button"
              onClick={() => onViewModeChange('table')}
              className={`p-1.5 rounded-md text-xs font-medium flex items-center gap-1 transition-all cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-card text-foreground shadow-2xs font-semibold'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              title="Table View"
              aria-label="Table View"
            >
              <TableProperties className="w-4 h-4" />
              <span className="hidden md:inline text-xs">Table</span>
            </button>
          </div>

          {/* Delete Selected Button */}
          {selectedCount !== undefined && selectedCount > 0 && onBatchDelete && (
            <button
              type="button"
              onClick={onBatchDelete}
              disabled={isDeletingBatch}
              className="flex items-center gap-1.5 sm:gap-2 bg-destructive/10 text-destructive hover:bg-destructive hover:text-destructive-foreground rounded-lg p-2 sm:px-3 sm:py-2 shrink-0 shadow-2xs transition-colors cursor-pointer text-xs sm:text-sm font-medium disabled:opacity-50"
              title="Delete Selected Permits"
            >
              {isDeletingBatch ? (
                <Loader2 className="w-4 h-4 animate-spin shrink-0" />
              ) : (
                <Trash2 className="w-4 h-4 shrink-0" />
              )}
              <span className="hidden sm:inline">Delete ({selectedCount})</span>
            </button>
          )}
        </div>

        <div className="text-xs sm:text-sm text-muted-foreground font-mono self-end sm:self-auto">
          {totalFiltered !== counts.total
            ? `${totalFiltered} of ${counts.total} permits`
            : `${counts.total} permits`}
        </div>
      </div>
    </div>
  );
};
