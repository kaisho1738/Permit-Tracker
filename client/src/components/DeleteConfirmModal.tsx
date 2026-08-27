import React, { useState, useEffect } from 'react';
import { Trash2, X, Loader2 } from 'lucide-react';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  title?: string;
  description?: string;
  count?: number;
  itemName?: string;
  confirmKeyword?: string;
  confirmButtonText?: string;
  isDeleting?: boolean;
  onConfirm: () => void | Promise<void>;
  onClose: () => void;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  title = 'Delete Confirmation',
  description,
  count,
  itemName,
  confirmKeyword,
  confirmButtonText,
  isDeleting = false,
  onConfirm,
  onClose,
}) => {
  const [typedKeyword, setTypedKeyword] = useState('');

  // Reset confirmation input when opening/closing
  useEffect(() => {
    if (!isOpen) {
      setTypedKeyword('');
    }
  }, [isOpen]);

  // Handle ESC key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isDeleting) {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, isDeleting, onClose]);

  if (!isOpen) return null;

  const isKeywordValid = !confirmKeyword || typedKeyword.trim().toUpperCase() === confirmKeyword.toUpperCase();
  const isConfirmDisabled = isDeleting || !isKeywordValid;

  const getButtonLabel = () => {
    if (confirmButtonText) return confirmButtonText;
    if (count && count > 1) return `Delete ${count} Permits`;
    return 'Delete Permit';
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isDeleting) onClose();
      }}
    >
      <div
        className="bg-card text-card-foreground border border-border rounded-2xl shadow-xl max-w-[360px] w-full p-5 sm:p-6 transition-all relative animate-in fade-in zoom-in-95"
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-modal-title"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={isDeleting}
          className="absolute top-3.5 right-3.5 w-7 h-7 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors disabled:opacity-50 cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Top-Centered Icon Badge */}
        <div className="w-12 h-12 rounded-full bg-destructive/10 border border-destructive/20 mx-auto flex items-center justify-center text-destructive mb-3.5 shadow-2xs">
          <Trash2 className="w-5 h-5" />
        </div>

        {/* Centered Title & Description */}
        <div className="text-center">
          <h3
            id="delete-modal-title"
            className="text-base font-semibold text-foreground leading-snug"
          >
            {title}
          </h3>

          <p className="mt-1.5 text-xs sm:text-sm text-muted-foreground leading-relaxed">
            {description || (
              count && count > 1 ? (
                <>
                  Are you sure you want to delete{' '}
                  <strong className="text-foreground font-semibold">
                    {count} selected permits
                  </strong>
                  ? This action cannot be undone.
                </>
              ) : (
                <>
                  Are you sure you want to remove{' '}
                  {itemName ? (
                    <strong className="text-foreground font-semibold">
                      "{itemName}"
                    </strong>
                  ) : (
                    'this permit'
                  )}
                  ? This action cannot be undone.
                </>
              )
            )}
          </p>
        </div>

        {/* Destructive Action Friction Input */}
        {confirmKeyword && (
          <div className="mt-4 pt-3 border-t border-border">
            <label className="block text-xs font-medium text-muted-foreground mb-1.5 text-left">
              Type <span className="font-bold text-destructive font-mono uppercase">"{confirmKeyword}"</span> to confirm:
            </label>
            <input
              type="text"
              value={typedKeyword}
              onChange={(e) => setTypedKeyword(e.target.value)}
              placeholder={confirmKeyword}
              disabled={isDeleting}
              autoFocus
              className="w-full px-3 py-2 text-xs sm:text-sm border border-input rounded-lg bg-card text-foreground placeholder:text-muted-foreground focus:ring-1 focus:ring-destructive focus:border-destructive outline-none transition-colors"
            />
          </div>
        )}

        {/* Modal Actions (Balanced Side-by-Side Hierarchy) */}
        <div className="mt-5 grid grid-cols-2 gap-2.5">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="w-full px-3.5 py-2 text-xs sm:text-sm font-medium border border-input rounded-lg hover:bg-muted text-foreground transition-colors cursor-pointer disabled:opacity-50 focus:outline-none"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isConfirmDisabled}
            className="w-full px-3.5 py-2 text-xs sm:text-sm font-semibold bg-destructive hover:bg-destructive/90 text-destructive-foreground rounded-lg transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none"
          >
            {isDeleting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Deleting...</span>
              </>
            ) : (
              <span>{getButtonLabel()}</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
