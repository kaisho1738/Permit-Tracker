import React from 'react';
import { SortField, SortDirection } from '../types/permit';
import { X, ArrowUpDown, ArrowUp, ArrowDown, Check, RotateCcw, Calendar, Building, FileText } from 'lucide-react';

interface SortModalProps {
  isOpen: boolean;
  sortField: SortField;
  sortDir: SortDirection;
  onSortChange: (field: SortField, dir: SortDirection) => void;
  onClose: () => void;
}

interface ColumnOption {
  id: SortField;
  label: string;
  icon: React.ReactNode;
  ascLabel: string;
  descLabel: string;
}

const COLUMNS: ColumnOption[] = [
  {
    id: 'company',
    label: 'Company Name',
    icon: <Building className="w-4 h-4" />,
    ascLabel: 'A to Z (Alphabetical)',
    descLabel: 'Z to A (Reverse)',
  },
  {
    id: 'permit',
    label: 'Permit Name',
    icon: <FileText className="w-4 h-4" />,
    ascLabel: 'A to Z (Alphabetical)',
    descLabel: 'Z to A (Reverse)',
  },
  {
    id: 'expiry',
    label: 'Expiry Date',
    icon: <Calendar className="w-4 h-4" />,
    ascLabel: 'Earliest to Latest',
    descLabel: 'Latest to Earliest',
  },
  {
    id: 'date_issued',
    label: 'Date Issued',
    icon: <Calendar className="w-4 h-4" />,
    ascLabel: 'Oldest to Newest',
    descLabel: 'Newest to Oldest',
  },
];

export const SortModal: React.FC<SortModalProps> = ({
  isOpen,
  sortField,
  sortDir,
  onSortChange,
  onClose,
}) => {
  if (!isOpen) return null;

  const currentColumn = COLUMNS.find((c) => c.id === sortField) || COLUMNS[2];

  const handleSelectColumn = (field: SortField) => {
    onSortChange(field, sortDir);
  };

  const handleSelectDir = (dir: SortDirection) => {
    onSortChange(sortField, dir);
  };

  const handleReset = () => {
    onSortChange('expiry', 'asc');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div
        className="bg-card text-card-foreground border border-border rounded-xl shadow-2xl max-w-md w-full p-4 sm:p-6 transition-all duration-200 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-border">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-accent text-primary flex items-center justify-center">
              <ArrowUpDown className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground">Sort Permits</h2>
              <p className="text-xs text-muted-foreground">
                Configure table column and ordering direction
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Section 1: Column Selection */}
        <div className="mt-5">
          <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2.5">
            1. Select Column
          </label>
          <div className="grid grid-cols-2 gap-2">
            {COLUMNS.map((col) => {
              const isSelected = sortField === col.id;
              return (
                <button
                  key={col.id}
                  type="button"
                  onClick={() => handleSelectColumn(col.id)}
                  className={`p-3 rounded-lg border text-left flex items-center justify-between transition-all cursor-pointer ${
                    isSelected
                      ? 'border-primary bg-accent/60 text-primary font-semibold ring-1 ring-primary'
                      : 'border-border bg-card text-foreground hover:bg-muted'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className={isSelected ? 'text-primary' : 'text-muted-foreground'}>
                      {col.icon}
                    </span>
                    <span className="text-xs sm:text-sm truncate">{col.label}</span>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-primary shrink-0 ml-1" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Section 2: Sort Direction Selection */}
        <div className="mt-5">
          <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2.5">
            2. Sort By (Direction)
          </label>
          <div className="grid grid-cols-2 gap-2">
            {/* Ascending Button */}
            <button
              type="button"
              onClick={() => handleSelectDir('asc')}
              className={`p-3 rounded-lg border text-left flex flex-col gap-1 transition-all cursor-pointer ${
                sortDir === 'asc'
                  ? 'border-primary bg-accent/60 text-primary font-semibold ring-1 ring-primary'
                  : 'border-border bg-card text-foreground hover:bg-muted'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-sm font-semibold">
                  <ArrowUp className="w-4 h-4" />
                  <span>Ascending</span>
                </div>
                {sortDir === 'asc' && <Check className="w-4 h-4 text-primary" />}
              </div>
              <span className="text-xs text-muted-foreground font-normal">
                {currentColumn.ascLabel}
              </span>
            </button>

            {/* Descending Button */}
            <button
              type="button"
              onClick={() => handleSelectDir('desc')}
              className={`p-3 rounded-lg border text-left flex flex-col gap-1 transition-all cursor-pointer ${
                sortDir === 'desc'
                  ? 'border-primary bg-accent/60 text-primary font-semibold ring-1 ring-primary'
                  : 'border-border bg-card text-foreground hover:bg-muted'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-sm font-semibold">
                  <ArrowDown className="w-4 h-4" />
                  <span>Descending</span>
                </div>
                {sortDir === 'desc' && <Check className="w-4 h-4 text-primary" />}
              </div>
              <span className="text-xs text-muted-foreground font-normal">
                {currentColumn.descLabel}
              </span>
            </button>
          </div>
        </div>

        {/* Live Status Summary Card */}
        <div className="mt-4 p-3 rounded-lg bg-muted/60 border border-border text-xs text-muted-foreground flex items-center gap-2">
          <span className="font-semibold text-foreground">Active sort:</span>
          <span>
            {currentColumn.label} •{' '}
            <strong className="text-primary font-medium">
              {sortDir === 'asc' ? 'Ascending' : 'Descending'}
            </strong>{' '}
            ({sortDir === 'asc' ? currentColumn.ascLabel : currentColumn.descLabel})
          </span>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-5 mt-5 border-t border-border">
          <button
            type="button"
            onClick={handleReset}
            className="px-3 py-2 text-xs font-medium text-muted-foreground hover:text-foreground flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to default</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 text-sm font-medium text-primary-foreground bg-primary border border-transparent rounded-md hover:bg-primary/90 transition-colors shadow-sm cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
