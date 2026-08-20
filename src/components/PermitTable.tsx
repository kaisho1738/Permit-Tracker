import React, { useState } from 'react';
import { Permit, SortField, SortDirection } from '../types/permit';
import { getMonthsDiff, getStatus, getRemarks, getStatusMeta, formatDateDisplay } from '../utils/dateUtils';
import { ArrowUpDown, ArrowUp, ArrowDown, MoreVertical, FolderOpen } from 'lucide-react';
import { ActionMenu } from './ActionMenu';

interface PermitTableProps {
  permits: Permit[];
  sortField: SortField;
  sortDir: SortDirection;
  onSort: (field: SortField) => void;
  onEditPermit: (permit: Permit) => void;
  onDeletePermit: (id: number) => void;
  onOpenAddModal: () => void;
}

export const PermitTable: React.FC<PermitTableProps> = ({
  permits,
  sortField,
  sortDir,
  onSort,
  onEditPermit,
  onDeletePermit,
  onOpenAddModal,
}) => {
  const [activeMenu, setActiveMenu] = useState<{
    permit: Permit;
    position: { top: number; left: number };
  } | null>(null);

  const handleOpenMenu = (e: React.MouseEvent<HTMLButtonElement>, permit: Permit) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    setActiveMenu({
      permit,
      position: {
        top: rect.bottom + window.scrollY + 4,
        left: rect.right + window.scrollX - 144,
      },
    });
  };

  const renderSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="w-3 h-3 ml-1 text-gray-400 dark:text-on-surface-variant/50 inline" />;
    }
    return sortDir === 'asc' ? (
      <ArrowUp className="w-3 h-3 ml-1 text-brand-600 dark:text-primary inline" />
    ) : (
      <ArrowDown className="w-3 h-3 ml-1 text-brand-600 dark:text-primary inline" />
    );
  };

  return (
    <div className="overflow-x-auto flex-1">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-outline-variant">
        <thead className="bg-[#f4f3f0] dark:bg-surface-container-low select-none transition-colors">
          <tr>
            <th
              onClick={() => onSort('plant')}
              scope="col"
              className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-on-surface-variant uppercase tracking-wider whitespace-nowrap cursor-pointer hover:text-gray-900 dark:hover:text-on-surface"
            >
              Powerplant Name {renderSortIcon('plant')}
            </th>
            <th
              onClick={() => onSort('environmental_law')}
              scope="col"
              className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-on-surface-variant uppercase tracking-wider whitespace-nowrap cursor-pointer hover:text-gray-900 dark:hover:text-on-surface"
            >
              Environmental Law {renderSortIcon('environmental_law')}
            </th>
            <th
              scope="col"
              className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-on-surface-variant uppercase tracking-wider"
            >
              Description
            </th>
            <th
              onClick={() => onSort('permit')}
              scope="col"
              className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-on-surface-variant uppercase tracking-wider whitespace-nowrap cursor-pointer hover:text-gray-900 dark:hover:text-on-surface"
            >
              Permit {renderSortIcon('permit')}
            </th>
            <th
              scope="col"
              className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-on-surface-variant uppercase tracking-wider"
            >
              Unit / Coverage
            </th>
            <th
              scope="col"
              className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-on-surface-variant uppercase tracking-wider whitespace-nowrap"
            >
              Permit No.
            </th>
            <th
              onClick={() => onSort('date_issued')}
              scope="col"
              className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-on-surface-variant uppercase tracking-wider whitespace-nowrap cursor-pointer hover:text-gray-900 dark:hover:text-on-surface"
            >
              Date Issued {renderSortIcon('date_issued')}
            </th>
            <th
              onClick={() => onSort('expiry')}
              scope="col"
              className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-on-surface-variant uppercase tracking-wider whitespace-nowrap cursor-pointer hover:text-gray-900 dark:hover:text-on-surface"
            >
              Expiry Date {renderSortIcon('expiry')}
            </th>
            <th
              scope="col"
              className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-on-surface-variant uppercase tracking-wider"
            >
              Status
            </th>
            <th
              scope="col"
              className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-on-surface-variant uppercase tracking-wider"
            >
              Remarks
            </th>
            <th scope="col" className="relative px-4 py-3 w-10 text-center">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-surface-container divide-y divide-gray-200 dark:divide-outline-variant text-sm transition-colors">
          {permits.map((row) => {
            const months = getMonthsDiff(row.expiry);
            const status = getStatus(months);
            const meta = getStatusMeta(status);
            const autoRemarks = getRemarks(months);
            const remarksText = row.remarksAuto === false && row.remarks ? row.remarks : autoRemarks;

            return (
              <tr
                key={row.id}
                className="hover:bg-gray-50 dark:hover:bg-surface-container-high transition-colors"
              >
                <td className="px-4 py-4 whitespace-nowrap text-gray-900 dark:text-on-surface font-semibold text-sm">
                  {row.plant || '—'}
                </td>
                <td className="px-4 py-4 text-gray-900 dark:text-on-surface font-medium text-sm">
                  {row.environmental_law || '—'}
                </td>
                <td className="px-4 py-4 text-gray-500 dark:text-on-surface-variant text-sm">
                  {row.description || '—'}
                </td>
                <td className="px-4 py-4 text-gray-900 dark:text-on-surface text-sm">
                  {row.permit || '—'}
                </td>
                <td className="px-4 py-4 text-gray-500 dark:text-on-surface-variant text-sm">
                  {row.unit_coverage || '—'}
                </td>
                <td className="px-4 py-4 text-gray-900 dark:text-on-surface text-sm font-mono whitespace-nowrap">
                  {row.permit_no || '—'}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-gray-900 dark:text-on-surface text-sm">
                  {formatDateDisplay(row.date_issued)}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-gray-900 dark:text-on-surface text-sm font-medium">
                  {formatDateDisplay(row.expiry)}
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${meta.badgeClass}`}
                  >
                    <div className={`w-1.5 h-1.5 rounded-full ${meta.dotClass} mr-1.5`} />
                    {meta.label}
                  </span>
                </td>
                <td
                  className="px-4 py-4 text-gray-900 dark:text-on-surface text-sm max-w-[200px] truncate"
                  title={remarksText}
                >
                  {remarksText || '—'}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-right text-gray-400 dark:text-on-surface-variant">
                  <button
                    onClick={(e) => handleOpenMenu(e, row)}
                    className="w-8 h-8 rounded-md flex items-center justify-center hover:bg-gray-200 dark:hover:bg-surface-container-highest transition-colors focus:outline-none cursor-pointer"
                    title="Actions"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Empty State */}
      {permits.length === 0 && (
        <div className="text-center py-12 px-4">
          <FolderOpen className="w-10 h-10 text-gray-300 dark:text-outline mx-auto mb-3" />
          <p className="text-sm text-gray-500 dark:text-on-surface-variant">
            No permits found.{' '}
            <button
              onClick={onOpenAddModal}
              className="text-brand-600 dark:text-primary font-medium hover:underline cursor-pointer"
            >
              Add a new permit
            </button>
          </p>
        </div>
      )}

      {/* Action Menu Popover */}
      {activeMenu && (
        <ActionMenu
          isOpen={Boolean(activeMenu)}
          position={activeMenu.position}
          onEdit={() => onEditPermit(activeMenu.permit)}
          onDelete={() => onDeletePermit(activeMenu.permit.id)}
          onClose={() => setActiveMenu(null)}
        />
      )}
    </div>
  );
};
