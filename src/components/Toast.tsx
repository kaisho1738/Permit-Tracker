import React from 'react';
import { CheckCircle2 } from 'lucide-react';

interface ToastProps {
  message: string | null;
}

export const Toast: React.FC<ToastProps> = ({ message }) => {
  if (!message) return null;

  return (
    <div className="fixed bottom-6 right-6 bg-gray-900 dark:bg-surface-container-highest text-white dark:text-on-surface text-sm px-4 py-2.5 rounded-lg shadow-xl border border-transparent dark:border-outline z-50 flex items-center gap-2 animate-in fade-in slide-in-from-bottom-3 duration-200">
      <CheckCircle2 className="w-4 h-4 text-success-500" />
      <span>{message}</span>
    </div>
  );
};
