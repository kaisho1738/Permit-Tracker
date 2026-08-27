import React, { useEffect } from 'react';
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
  // Prevent background scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !permit) return null;

  const months = getMonthsDiff(permit.expiry);
  const status = getStatus(months);
  const meta = getStatusMeta(status);
  const autoRemarks = getRemarks(months);
  const remarksText = permit.remarksAuto === false && permit.remarks ? permit.remarks : autoRemarks;
  const isCustomRemarks = permit.remarksAuto === false && Boolean(permit.remarks);

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="bg-card text-card-foreground border border-border rounded-xl shadow-2xl max-w-lg w-full flex flex-col max-h-[92dvh] sm:max-h-[85vh] transition-all duration-200 relative my-auto overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between px-4 py-3.5 sm:px-6 sm:py-4 border-b border-border shrink-0 bg-card">
          <div className="min-w-0 flex-1 pr-2">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${meta.badgeClass}`}
              >
                <div className={`w-1.5 h-1.5 rounded-full ${meta.dotClass} mr-1.5`} />
                {meta.label}
              </span>
              {isCustomRemarks && (
                <span className="text-[11px] font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                  Custom Remark
                </span>
              )}
            </div>
            <h2 className="text-base sm:text-lg font-bold text-foreground truncate">
              {permit.company || 'Untitled Company'}
            </h2>
            <p className="text-xs sm:text-sm font-medium text-primary mt-0.5 truncate">
              {permit.permit || 'Permit'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer shrink-0"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body Content */}
        <div className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1 min-h-0">
          {/* Remarks Box */}
          <div className="p-3.5 sm:p-4 rounded-xl bg-muted/50 border border-border">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
              <MessageSquare className="w-4 h-4 text-primary" />
              <span>Remarks</span>
            </div>
            <p className="text-sm sm:text-base text-foreground font-medium leading-relaxed">
              {remarksText || 'No remarks recorded.'}
            </p>
          </div>

          {/* Permit Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 text-sm">
            <div className="p-3 bg-muted/40 rounded-lg border border-border">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium mb-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Environmental Law</span>
              </div>
              <div className="font-semibold text-foreground truncate" title={permit.environmental_law}>
                {permit.environmental_law || '—'}
              </div>
            </div>

            <div className="p-3 bg-muted/40 rounded-lg border border-border">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium mb-1">
                <Hash className="w-3.5 h-3.5" />
                <span>Permit No.</span>
              </div>
              <div className="font-mono font-semibold text-foreground truncate" title={permit.permit_no}>
                {permit.permit_no || '—'}
              </div>
            </div>

            <div className="p-3 bg-muted/40 rounded-lg border border-border">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium mb-1">
                <Building className="w-3.5 h-3.5" />
                <span>Unit / Coverage</span>
              </div>
              <div className="font-semibold text-foreground truncate" title={permit.unit_coverage}>
                {permit.unit_coverage || '—'}
              </div>
            </div>

            <div className="p-3 bg-muted/40 rounded-lg border border-border">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium mb-1">
                <Tag className="w-3.5 h-3.5" />
                <span>Description</span>
              </div>
              <div className="font-semibold text-foreground truncate" title={permit.description}>
                {permit.description || '—'}
              </div>
            </div>

            <div className="p-3 bg-muted/40 rounded-lg border border-border">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium mb-1">
                <Calendar className="w-3.5 h-3.5" />
                <span>Date Issued</span>
              </div>
              <div className="font-semibold text-foreground">
                {formatDateDisplay(permit.date_issued)}
              </div>
            </div>

            <div className="p-3 bg-muted/40 rounded-lg border border-border">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium mb-1">
                <Calendar className="w-3.5 h-3.5" />
                <span>Expiry Date</span>
              </div>
              <div className="font-semibold text-foreground">
                {formatDateDisplay(permit.expiry)}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 px-4 py-3 sm:px-6 sm:py-4 border-t border-border shrink-0 bg-muted/20">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-foreground bg-card border border-input rounded-md hover:bg-muted transition-colors cursor-pointer"
          >
            Close
          </button>
          <button
            type="button"
            onClick={() => {
              onClose();
              onEdit(permit);
            }}
            className="px-4 py-2 text-sm font-medium text-primary-foreground bg-primary border border-transparent rounded-md hover:bg-primary/90 transition-colors shadow-sm flex items-center gap-2 cursor-pointer"
          >
            <Edit3 className="w-4 h-4" />
            <span>Edit Permit</span>
          </button>
        </div>
      </div>
    </div>
  );
};

