import React from 'react';
import { Permit } from '../types/permit';
import { getMonthsDiff, getStatus, getRemarks, getStatusMeta, formatDateDisplay } from '../utils/dateUtils';
import { X, MessageSquare, Calendar, Building, ShieldCheck, Tag, Hash, Edit3 } from 'lucide-react';

interface RemarksModalProps {
  permit: Permit | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (permit: Permit) => void;
}

export const RemarksModal: React.FC<RemarksModalProps> = ({
  permit,
  isOpen,
  onClose,
  onEdit,
}) => {
  if (!isOpen || !permit) return null;

  const months = getMonthsDiff(permit.expiry);
  const status = getStatus(months);
  const meta = getStatusMeta(status);
  const autoRemarks = getRemarks(months);
  const remarksText = permit.remarksAuto === false && permit.remarks ? permit.remarks : autoRemarks;
  const isCustomRemarks = permit.remarksAuto === false && Boolean(permit.remarks);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div
        className="bg-white dark:bg-surface-container border border-gray-200 dark:border-outline-variant rounded-xl shadow-2xl max-w-lg w-full p-6 transition-all duration-200 relative text-gray-900 dark:text-on-surface"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-gray-100 dark:border-outline-variant">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${meta.badgeClass}`}
              >
                <div className={`w-1.5 h-1.5 rounded-full ${meta.dotClass} mr-1.5`} />
                {meta.label}
              </span>
              {isCustomRemarks && (
                <span className="text-[11px] font-medium text-gray-500 dark:text-on-surface-variant bg-gray-100 dark:bg-surface-container-high px-2 py-0.5 rounded-full">
                  Custom Remark
                </span>
              )}
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-on-surface">
              {permit.plant || 'Untitled Plant'}
            </h2>
            <p className="text-sm font-medium text-brand-600 dark:text-primary mt-0.5">
              {permit.permit || 'Permit'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-600 dark:hover:text-on-surface hover:bg-gray-100 dark:hover:bg-surface-container-high transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Remarks Box */}
        <div className="my-5 p-4 rounded-xl bg-[#faf9f6] dark:bg-surface-container-high border border-gray-200/80 dark:border-outline-variant/60">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-on-surface-variant mb-2">
            <MessageSquare className="w-4 h-4 text-brand-600 dark:text-primary" />
            <span>Remarks</span>
          </div>
          <p className="text-base text-gray-800 dark:text-on-surface font-medium leading-relaxed">
            {remarksText || 'No remarks recorded.'}
          </p>
        </div>

        {/* Permit Details Grid */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="p-3 bg-gray-50 dark:bg-surface-container-low rounded-lg border border-gray-100 dark:border-outline-variant/40">
            <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-on-surface-variant font-medium mb-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Environmental Law</span>
            </div>
            <div className="font-semibold text-gray-900 dark:text-on-surface truncate" title={permit.environmental_law}>
              {permit.environmental_law || '—'}
            </div>
          </div>

          <div className="p-3 bg-gray-50 dark:bg-surface-container-low rounded-lg border border-gray-100 dark:border-outline-variant/40">
            <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-on-surface-variant font-medium mb-1">
              <Hash className="w-3.5 h-3.5" />
              <span>Permit No.</span>
            </div>
            <div className="font-mono font-semibold text-gray-900 dark:text-on-surface truncate" title={permit.permit_no}>
              {permit.permit_no || '—'}
            </div>
          </div>

          <div className="p-3 bg-gray-50 dark:bg-surface-container-low rounded-lg border border-gray-100 dark:border-outline-variant/40">
            <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-on-surface-variant font-medium mb-1">
              <Building className="w-3.5 h-3.5" />
              <span>Unit / Coverage</span>
            </div>
            <div className="font-semibold text-gray-900 dark:text-on-surface truncate" title={permit.unit_coverage}>
              {permit.unit_coverage || '—'}
            </div>
          </div>

          <div className="p-3 bg-gray-50 dark:bg-surface-container-low rounded-lg border border-gray-100 dark:border-outline-variant/40">
            <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-on-surface-variant font-medium mb-1">
              <Tag className="w-3.5 h-3.5" />
              <span>Description</span>
            </div>
            <div className="font-semibold text-gray-900 dark:text-on-surface truncate" title={permit.description}>
              {permit.description || '—'}
            </div>
          </div>

          <div className="p-3 bg-gray-50 dark:bg-surface-container-low rounded-lg border border-gray-100 dark:border-outline-variant/40">
            <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-on-surface-variant font-medium mb-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>Date Issued</span>
            </div>
            <div className="font-semibold text-gray-900 dark:text-on-surface">
              {formatDateDisplay(permit.date_issued)}
            </div>
          </div>

          <div className="p-3 bg-gray-50 dark:bg-surface-container-low rounded-lg border border-gray-100 dark:border-outline-variant/40">
            <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-on-surface-variant font-medium mb-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>Expiry Date</span>
            </div>
            <div className="font-semibold text-gray-900 dark:text-on-surface">
              {formatDateDisplay(permit.expiry)}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 pt-5 mt-5 border-t border-gray-100 dark:border-outline-variant">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 dark:text-on-surface dark:bg-surface-container-high dark:border-outline dark:hover:bg-surface-container-highest transition-colors cursor-pointer"
          >
            Close
          </button>
          <button
            type="button"
            onClick={() => {
              onClose();
              onEdit(permit);
            }}
            className="px-4 py-2 text-sm font-medium text-white bg-brand-600 border border-transparent rounded-md hover:bg-brand-700 dark:text-on-primary dark:bg-primary dark:hover:bg-primary/90 transition-colors shadow-sm flex items-center gap-2 cursor-pointer"
          >
            <Edit3 className="w-4 h-4" />
            <span>Edit Permit</span>
          </button>
        </div>
      </div>
    </div>
  );
};
