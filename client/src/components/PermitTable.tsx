import React from 'react';
import { Permit } from '../types/permit';
import { getMonthsDiff, getStatus, getStatusMeta, formatDateDisplay } from '../utils/dateUtils';
import { Trash2, FolderOpen, Loader2, Calendar, FileCheck, Layers, Hash } from 'lucide-react';

interface PermitTableProps {
  permits: Permit[];
  isLoading?: boolean;
  deletingId?: number | null;
  onViewRemarks: (permit: Permit) => void;
  onDeletePermit: (id: number) => void;
  onOpenAddModal: () => void;
  viewMode?: 'table' | 'cards';
  selectedIds?: number[];
  onSelectPermit?: (id: number, checked: boolean) => void;
  onSelectAll?: (ids: number[], checked: boolean) => void;
}

export const PermitTable: React.FC<PermitTableProps> = ({
  permits,
  isLoading = false,
  deletingId,
  onViewRemarks,
  onDeletePermit,
  onOpenAddModal,
  viewMode = 'table',
  selectedIds = [],
  onSelectPermit,
  onSelectAll,
}) => {
  const currentIds = permits.map(p => p.id);
  const isAllSelected = currentIds.length > 0 && currentIds.every(id => selectedIds.includes(id));
  const isSomeSelected = currentIds.some(id => selectedIds.includes(id));

  // Empty State (Common to both modes)
  if (!isLoading && permits.length === 0) {
    return (
      <div className="text-center py-12 px-4 flex-1 flex flex-col items-center justify-center">
        <FolderOpen className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
        <p className="text-sm text-muted-foreground">
          No permits found.{' '}
          <button
            onClick={onOpenAddModal}
            className="text-primary font-medium hover:underline cursor-pointer"
          >
            Add a new permit
          </button>
        </p>
      </div>
    );
  }

  // Cards Mode
  if (viewMode === 'cards') {
    return (
      <div className="p-3 sm:p-4 flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div
                key={`card-skeleton-${idx}`}
                className="bg-card border border-border rounded-lg p-4 animate-pulse space-y-3"
              >
                <div className="flex justify-between items-start gap-2">
                  <div className="h-5 bg-muted rounded w-3/5" />
                  <div className="h-5 bg-muted rounded-full w-20" />
                </div>
                <div className="h-4 bg-muted rounded w-4/5" />
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border">
                  <div className="h-3 bg-muted rounded w-20" />
                  <div className="h-3 bg-muted rounded w-20 ml-auto" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {permits.map((row) => {
              const months = getMonthsDiff(row.expiry);
              const status = getStatus(months);
              const meta = getStatusMeta(status);

              return (
                <div
                  key={row.id}
                  onClick={() => onViewRemarks(row)}
                  title="Click to view details and remarks"
                  className={`bg-card text-card-foreground border hover:border-primary/50 rounded-xl p-4 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group relative ${selectedIds.includes(row.id) ? 'border-primary bg-primary/5' : 'border-border'}`}
                >
                  {/* Selection Checkbox */}
                  {onSelectPermit && (
                    <div className="absolute top-4 right-4 z-10" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(row.id)}
                        onChange={(e) => onSelectPermit(row.id, e.target.checked)}
                        className="w-4 h-4 rounded border-border text-primary focus:ring-primary focus:ring-offset-background cursor-pointer"
                        title="Select permit"
                        aria-label="Select permit"
                      />
                    </div>
                  )}

                  {/* Card Header: Company Name & Status */}
                  <div className="flex items-start justify-between gap-2 mb-2.5 pr-6">
                    <div className="min-w-0 flex-1">
                      <span className="text-xs font-semibold uppercase tracking-wider text-primary block mb-0.5">
                        Company
                      </span>
                      <h4 className="text-base font-bold text-foreground truncate group-hover:text-primary transition-colors">
                        {row.plant || <span className="text-muted-foreground select-none font-normal">—</span>}
                      </h4>
                    </div>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border shrink-0 ${meta.badgeClass}`}
                    >
                      <div className={`w-1.5 h-1.5 rounded-full ${meta.dotClass} mr-1.5`} />
                      {meta.label}
                    </span>
                  </div>

                  {/* Card Details */}
                  <div className="space-y-2 text-xs text-muted-foreground my-1">
                    {/* Permit Name & Law */}
                    <div className="flex items-start gap-1.5">
                      <FileCheck className="w-3.5 h-3.5 text-muted-foreground shrink-0 mt-0.5" />
                      <div className="min-w-0 flex-1">
                        <span className="font-semibold text-foreground">
                          {row.permit || <span className="text-muted-foreground select-none font-normal">—</span>}
                        </span>
                        {row.environmental_law && (
                          <span className="text-muted-foreground block truncate">
                            {row.environmental_law}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Coverage / Unit */}
                    {row.unit_coverage && (
                      <div className="flex items-start gap-1.5 text-muted-foreground">
                        <Layers className="w-3.5 h-3.5 text-muted-foreground shrink-0 mt-0.5" />
                        <span className="truncate">{row.unit_coverage}</span>
                      </div>
                    )}

                    {/* Permit No */}
                    {row.permit_no && (
                      <div className="flex items-center gap-1.5 font-mono text-muted-foreground">
                        <Hash className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                        <span className="truncate">{row.permit_no}</span>
                      </div>
                    )}
                  </div>

                  {/* Card Footer: Dates & Actions */}
                  <div className="pt-3 mt-2 border-t border-border flex items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Calendar className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                      <span>
                        Exp:{' '}
                        <strong className="text-foreground font-semibold">
                          {formatDateDisplay(row.expiry)}
                        </strong>
                      </span>
                    </div>

                    <button
                      disabled={deletingId === row.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeletePermit(row.id);
                      }}
                      className="w-7 h-7 rounded-md flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors focus:outline-none cursor-pointer disabled:opacity-50"
                      title="Delete Permit"
                      aria-label="Delete Permit"
                    >
                      {deletingId === row.id ? (
                        <Loader2 className="w-3.5 h-3.5 text-destructive animate-spin" />
                      ) : (
                        <Trash2 className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  // Table Mode
  return (
    <div className="overflow-x-auto flex-1">
      <table className="min-w-full divide-y divide-border text-sm">
        <thead className="bg-muted/80 text-muted-foreground select-none transition-colors">
          <tr>
            {onSelectAll && (
              <th scope="col" className="px-3.5 py-3 text-left w-10">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  ref={(input) => {
                    if (input) input.indeterminate = isSomeSelected && !isAllSelected;
                  }}
                  onChange={(e) => onSelectAll(currentIds, e.target.checked)}
                  className="w-4 h-4 rounded border-border text-primary focus:ring-primary focus:ring-offset-background cursor-pointer"
                  title="Select all on this page"
                  aria-label="Select all on this page"
                />
              </th>
            )}
            <th
              scope="col"
              className="px-3.5 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap"
            >
              Company Name
            </th>
            <th
              scope="col"
              className="px-3.5 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider"
            >
              Description
            </th>
            <th
              scope="col"
              className="px-3.5 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap"
            >
              Permit
            </th>
            <th
              scope="col"
              className="px-3.5 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider"
            >
              Unit / Coverage
            </th>
            <th
              scope="col"
              className="px-3.5 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap"
            >
              Permit No.
            </th>
            <th
              scope="col"
              className="px-3.5 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap"
            >
              Date Issued
            </th>
            <th
              scope="col"
              className="px-3.5 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap"
            >
              Expiry Date
            </th>
            <th
              scope="col"
              className="px-3.5 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap"
            >
              Status
            </th>
            <th scope="col" className="relative px-3.5 py-3 w-10 text-center">
              <span className="sr-only">Delete</span>
            </th>
          </tr>
        </thead>
        <tbody className="bg-card divide-y divide-border text-sm transition-colors">
          {isLoading ? (
            Array.from({ length: 5 }).map((_, idx) => (
              <tr key={`skeleton-${idx}`} className="animate-pulse">
                {onSelectAll && <td className="px-3.5 py-4"><div className="h-4 w-4 bg-muted rounded" /></td>}
                <td className="px-3.5 py-4"><div className="h-4 bg-muted rounded w-28" /></td>
                <td className="px-3.5 py-4"><div className="h-4 bg-muted rounded w-32" /></td>
                <td className="px-3.5 py-4"><div className="h-4 bg-muted rounded w-20" /></td>
                <td className="px-3.5 py-4"><div className="h-4 bg-muted rounded w-24" /></td>
                <td className="px-3.5 py-4"><div className="h-4 bg-muted rounded w-20" /></td>
                <td className="px-3.5 py-4"><div className="h-4 bg-muted rounded w-16" /></td>
                <td className="px-3.5 py-4"><div className="h-4 bg-muted rounded w-16" /></td>
                <td className="px-3.5 py-4"><div className="h-5 bg-muted rounded-full w-20" /></td>
                <td className="px-3.5 py-4 text-right"><div className="h-6 w-6 bg-muted rounded ml-auto" /></td>
              </tr>
            ))
          ) : (
            permits.map((row) => {
              const months = getMonthsDiff(row.expiry);
              const status = getStatus(months);
              const meta = getStatusMeta(status);

              return (
                <tr
                  key={row.id}
                  onClick={() => onViewRemarks(row)}
                  title="Click to view remarks and permit details"
                  className={`transition-colors cursor-pointer group ${selectedIds.includes(row.id) ? 'bg-primary/5' : 'hover:bg-accent/40'}`}
                >
                  {onSelectPermit && (
                    <td className="px-3.5 py-3.5 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(row.id)}
                        onChange={(e) => onSelectPermit(row.id, e.target.checked)}
                        className="w-4 h-4 rounded border-border text-primary focus:ring-primary focus:ring-offset-background cursor-pointer"
                        title="Select permit"
                        aria-label="Select permit"
                      />
                    </td>
                  )}
                  <td className="px-3.5 py-3.5">
                    <div className="text-foreground font-semibold text-sm">
                      {row.plant || <span className="text-muted-foreground select-none font-normal">—</span>}
                    </div>
                    {row.environmental_law && (
                      <div className="text-muted-foreground text-xs mt-0.5 font-normal">
                        {row.environmental_law}
                      </div>
                    )}
                  </td>
                  <td className="px-3.5 py-3.5 text-muted-foreground text-sm">
                    {row.description || <span className="text-muted-foreground select-none font-normal">—</span>}
                  </td>
                  <td className="px-3.5 py-3.5 text-foreground text-sm">
                    {row.permit || <span className="text-muted-foreground select-none font-normal">—</span>}
                  </td>
                  <td className="px-3.5 py-3.5 text-muted-foreground text-sm">
                    {row.unit_coverage || <span className="text-muted-foreground select-none font-normal">—</span>}
                  </td>
                  <td className="px-3.5 py-3.5 text-foreground text-sm font-mono whitespace-nowrap">
                    {row.permit_no || <span className="text-muted-foreground select-none font-normal">—</span>}
                  </td>
                  <td className="px-3.5 py-3.5 whitespace-nowrap text-foreground text-sm">
                    {row.date_issued ? formatDateDisplay(row.date_issued) : <span className="text-muted-foreground select-none font-normal">—</span>}
                  </td>
                  <td className="px-3.5 py-3.5 whitespace-nowrap text-foreground text-sm font-medium">
                    {row.expiry ? formatDateDisplay(row.expiry) : <span className="text-muted-foreground select-none font-normal">—</span>}
                  </td>
                  <td className="px-3.5 py-3.5 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${meta.badgeClass}`}
                    >
                      <div className={`w-1.5 h-1.5 rounded-full ${meta.dotClass} mr-1.5`} />
                      {meta.label}
                    </span>
                  </td>
                  <td className="px-3.5 py-3.5 whitespace-nowrap text-right text-muted-foreground">
                    <button
                      disabled={deletingId === row.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeletePermit(row.id);
                      }}
                      className="w-8 h-8 rounded-md flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors focus:outline-none cursor-pointer ml-auto disabled:opacity-50"
                      title="Delete Permit"
                    >
                      {deletingId === row.id ? (
                        <Loader2 className="w-4 h-4 text-destructive animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
};
