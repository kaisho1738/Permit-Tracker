import React from 'react';
import { Permit } from '../types/permit';
import { getMonthsDiff, getStatus, getStatusMeta, formatDateDisplay } from '../utils/dateUtils';
import { Trash2, FolderOpen } from 'lucide-react';

interface PermitTableProps {
  permits: Permit[];
  onViewRemarks: (permit: Permit) => void;
  onDeletePermit: (id: number) => void;
  onOpenAddModal: () => void;
}

export const PermitTable: React.FC<PermitTableProps> = ({
  permits,
  onViewRemarks,
  onDeletePermit,
  onOpenAddModal,
}) => {
  return (
    <div className="overflow-x-auto flex-1">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-outline-variant text-sm">
        <thead className="bg-[#f4f3f0] dark:bg-surface-container-low select-none transition-colors">
          <tr>
            <th
              scope="col"
              className="px-3.5 py-3 text-left text-xs font-semibold text-gray-500 dark:text-on-surface-variant uppercase tracking-wider whitespace-nowrap"
            >
              Powerplant Name
            </th>
            <th
              scope="col"
              className="px-3.5 py-3 text-left text-xs font-semibold text-gray-500 dark:text-on-surface-variant uppercase tracking-wider whitespace-nowrap"
            >
              Environmental Law
            </th>
            <th
              scope="col"
              className="px-3.5 py-3 text-left text-xs font-semibold text-gray-500 dark:text-on-surface-variant uppercase tracking-wider"
            >
              Description
            </th>
            <th
              scope="col"
              className="px-3.5 py-3 text-left text-xs font-semibold text-gray-500 dark:text-on-surface-variant uppercase tracking-wider whitespace-nowrap"
            >
              Permit
            </th>
            <th
              scope="col"
              className="px-3.5 py-3 text-left text-xs font-semibold text-gray-500 dark:text-on-surface-variant uppercase tracking-wider"
            >
              Unit / Coverage
            </th>
            <th
              scope="col"
              className="px-3 py-3 text-left text-xs font-semibold text-gray-500 dark:text-on-surface-variant uppercase tracking-wider whitespace-nowrap"
            >
              Permit No.
            </th>
            <th
              scope="col"
              className="px-3 py-3 text-left text-xs font-semibold text-gray-500 dark:text-on-surface-variant uppercase tracking-wider whitespace-nowrap"
            >
              Date Issued
            </th>
            <th
              scope="col"
              className="px-3 py-3 text-left text-xs font-semibold text-gray-500 dark:text-on-surface-variant uppercase tracking-wider whitespace-nowrap"
            >
              Expiry Date
            </th>
            <th
              scope="col"
              className="px-3 py-3 text-left text-xs font-semibold text-gray-500 dark:text-on-surface-variant uppercase tracking-wider whitespace-nowrap"
            >
              Status
            </th>
            <th scope="col" className="relative px-3 py-3 w-10 text-center">
              <span className="sr-only">Delete</span>
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-surface-container divide-y divide-gray-200 dark:divide-outline-variant text-sm transition-colors">
          {permits.map((row) => {
            const months = getMonthsDiff(row.expiry);
            const status = getStatus(months);
            const meta = getStatusMeta(status);

            return (
              <tr
                key={row.id}
                onClick={() => onViewRemarks(row)}
                title="Click to view remarks and permit details"
                className="hover:bg-blue-50/40 dark:hover:bg-surface-container-high transition-colors cursor-pointer group"
              >
                <td className="px-3.5 py-3.5 whitespace-nowrap text-gray-900 dark:text-on-surface font-semibold text-sm">
                  {row.plant || '—'}
                </td>
                <td className="px-3.5 py-3.5 text-gray-900 dark:text-on-surface font-medium text-sm">
                  {row.environmental_law || '—'}
                </td>
                <td className="px-3.5 py-3.5 text-gray-500 dark:text-on-surface-variant text-sm">
                  {row.description || '—'}
                </td>
                <td className="px-3.5 py-3.5 text-gray-900 dark:text-on-surface text-sm">
                  {row.permit || '—'}
                </td>
                <td className="px-3.5 py-3.5 text-gray-500 dark:text-on-surface-variant text-sm">
                  {row.unit_coverage || '—'}
                </td>
                <td className="px-3 py-3.5 text-gray-900 dark:text-on-surface text-sm font-mono whitespace-nowrap">
                  {row.permit_no || '—'}
                </td>
                <td className="px-3 py-3.5 whitespace-nowrap text-gray-900 dark:text-on-surface text-sm">
                  {formatDateDisplay(row.date_issued)}
                </td>
                <td className="px-3 py-3.5 whitespace-nowrap text-gray-900 dark:text-on-surface text-sm font-medium">
                  {formatDateDisplay(row.expiry)}
                </td>
                <td className="px-3 py-3.5 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${meta.badgeClass}`}
                  >
                    <div className={`w-1.5 h-1.5 rounded-full ${meta.dotClass} mr-1.5`} />
                    {meta.label}
                  </span>
                </td>
                <td className="px-3 py-3.5 whitespace-nowrap text-right text-gray-400 dark:text-on-surface-variant">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeletePermit(row.id);
                    }}
                    className="w-8 h-8 rounded-md flex items-center justify-center text-gray-400 hover:text-danger-500 hover:bg-danger-50 dark:hover:bg-error/10 dark:hover:text-error transition-colors focus:outline-none cursor-pointer ml-auto"
                    title="Delete Permit"
                  >
                    <Trash2 className="w-4 h-4" />
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
    </div>
  );
};
