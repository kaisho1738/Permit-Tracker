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
      <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-800 text-sm">
        <thead className="bg-[#f4f3f0] dark:bg-slate-800/80 select-none transition-colors">
          <tr>
            <th
              scope="col"
              className="px-3.5 py-3 text-left text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider whitespace-nowrap"
            >
              Powerplant Name
            </th>
            <th
              scope="col"
              className="px-3.5 py-3 text-left text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider whitespace-nowrap"
            >
              Environmental Law
            </th>
            <th
              scope="col"
              className="px-3.5 py-3 text-left text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider"
            >
              Description
            </th>
            <th
              scope="col"
              className="px-3.5 py-3 text-left text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider whitespace-nowrap"
            >
              Permit
            </th>
            <th
              scope="col"
              className="px-3.5 py-3 text-left text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider"
            >
              Unit / Coverage
            </th>
            <th
              scope="col"
              className="px-3 py-3 text-left text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider whitespace-nowrap"
            >
              Permit No.
            </th>
            <th
              scope="col"
              className="px-3 py-3 text-left text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider whitespace-nowrap"
            >
              Date Issued
            </th>
            <th
              scope="col"
              className="px-3 py-3 text-left text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider whitespace-nowrap"
            >
              Expiry Date
            </th>
            <th
              scope="col"
              className="px-3 py-3 text-left text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider whitespace-nowrap"
            >
              Status
            </th>
            <th scope="col" className="relative px-3 py-3 w-10 text-center">
              <span className="sr-only">Delete</span>
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-slate-900 divide-y divide-gray-200 dark:divide-slate-800 text-sm transition-colors">
          {permits.map((row) => {
            const months = getMonthsDiff(row.expiry);
            const status = getStatus(months);
            const meta = getStatusMeta(status);

            return (
              <tr
                key={row.id}
                onClick={() => onViewRemarks(row)}
                title="Click to view remarks and permit details"
                className="hover:bg-blue-50/40 dark:hover:bg-slate-800/60 transition-colors cursor-pointer group"
              >
                <td className="px-3.5 py-3.5 whitespace-nowrap text-gray-900 dark:text-slate-100 font-semibold text-sm">
                  {row.plant || '—'}
                </td>
                <td className="px-3.5 py-3.5 text-gray-900 dark:text-slate-200 font-medium text-sm">
                  {row.environmental_law || '—'}
                </td>
                <td className="px-3.5 py-3.5 text-gray-500 dark:text-slate-400 text-sm">
                  {row.description || '—'}
                </td>
                <td className="px-3.5 py-3.5 text-gray-900 dark:text-slate-200 text-sm">
                  {row.permit || '—'}
                </td>
                <td className="px-3.5 py-3.5 text-gray-500 dark:text-slate-400 text-sm">
                  {row.unit_coverage || '—'}
                </td>
                <td className="px-3.5 py-3.5 text-gray-900 dark:text-slate-200 text-sm font-mono whitespace-nowrap">
                  {row.permit_no || '—'}
                </td>
                <td className="px-3.5 py-3.5 whitespace-nowrap text-gray-900 dark:text-slate-200 text-sm">
                  {formatDateDisplay(row.date_issued)}
                </td>
                <td className="px-3.5 py-3.5 whitespace-nowrap text-gray-900 dark:text-slate-100 text-sm font-medium">
                  {formatDateDisplay(row.expiry)}
                </td>
                <td className="px-3.5 py-3.5 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${meta.badgeClass}`}
                  >
                    <div className={`w-1.5 h-1.5 rounded-full ${meta.dotClass} mr-1.5`} />
                    {meta.label}
                  </span>
                </td>
                <td className="px-3.5 py-3.5 whitespace-nowrap text-right text-gray-400 dark:text-slate-500">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeletePermit(row.id);
                    }}
                    className="w-8 h-8 rounded-md flex items-center justify-center text-gray-400 hover:text-danger-500 hover:bg-danger-50 dark:hover:bg-rose-950/40 dark:hover:text-rose-400 transition-colors focus:outline-none cursor-pointer ml-auto"
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
          <FolderOpen className="w-10 h-10 text-gray-300 dark:text-slate-600 mx-auto mb-3" />
          <p className="text-sm text-gray-500 dark:text-slate-400">
            No permits found.{' '}
            <button
              onClick={onOpenAddModal}
              className="text-brand-600 dark:text-indigo-400 font-medium hover:underline cursor-pointer"
            >
              Add a new permit
            </button>
          </p>
        </div>
      )}
    </div>
  );
};
