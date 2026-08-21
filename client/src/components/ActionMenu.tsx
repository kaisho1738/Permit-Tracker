import React, { useEffect, useRef } from 'react';
import { Edit2, Trash2 } from 'lucide-react';

interface ActionMenuProps {
  isOpen: boolean;
  position: { top: number; left: number };
  onViewRemarks?: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onClose: () => void;
}

export const ActionMenu: React.FC<ActionMenuProps> = ({
  isOpen,
  position,
  onViewRemarks,
  onEdit,
  onDelete,
  onClose,
}) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={menuRef}
      style={{ top: `${position.top}px`, left: `${position.left}px` }}
      className="fixed w-40 bg-white dark:bg-surface-container-high border border-gray-200 dark:border-outline-variant rounded-lg shadow-xl py-1 z-50 text-sm animate-in fade-in zoom-in-95 duration-100"
    >
      {onViewRemarks && (
        <button
          onClick={() => {
            onViewRemarks();
            onClose();
          }}
          className="w-full px-3 py-2 text-left text-gray-700 dark:text-on-surface hover:bg-gray-100 dark:hover:bg-surface-container-highest flex items-center gap-2.5 transition-colors cursor-pointer"
        >
          <span className="text-xs font-medium text-brand-600 dark:text-primary">💬</span>
          <span>View Remarks</span>
        </button>
      )}
      <button
        onClick={() => {
          onEdit();
          onClose();
        }}
        className="w-full px-3 py-2 text-left text-gray-700 dark:text-on-surface hover:bg-gray-100 dark:hover:bg-surface-container-highest flex items-center gap-2.5 transition-colors cursor-pointer border-t border-gray-50 dark:border-outline-variant/30"
      >
        <Edit2 className="w-3.5 h-3.5 text-brand-600 dark:text-primary" />
        <span>Edit Permit</span>
      </button>
      <button
        onClick={() => {
          onDelete();
          onClose();
        }}
        className="w-full px-3 py-2 text-left text-danger-500 dark:text-error hover:bg-danger-50 dark:hover:bg-error/10 flex items-center gap-2.5 transition-colors cursor-pointer border-t border-gray-100 dark:border-outline-variant"
      >
        <Trash2 className="w-3.5 h-3.5" />
        <span>Delete</span>
      </button>
    </div>
  );
};
