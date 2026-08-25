import React, { useState, useRef } from 'react';
import { FileText, Upload, Download, Plus, User, Loader2 } from 'lucide-react';
import { ProfileDropdown } from './ProfileDropdown';

interface HeaderProps {
  isImporting?: boolean;
  onAddPermit: () => void;
  onExportCSV: () => void;
  onImportCSV: (file: File) => void;
}

export const Header: React.FC<HeaderProps> = ({
  isImporting = false,
  onAddPermit,
  onExportCSV,
  onImportCSV,
}) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImportCSV(file);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <header className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 px-6 py-4 flex items-center justify-between sticky top-0 z-20 transition-colors duration-200 shadow-sm">
      {/* Title & Logo */}
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 bg-brand-50 dark:bg-indigo-950/50 border border-transparent dark:border-indigo-900/50 rounded-lg flex items-center justify-center text-brand-600 dark:text-indigo-400 transition-colors shadow-xs">
          <FileText className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-xl font-semibold text-gray-900 dark:text-slate-100 tracking-tight">
            Permity
          </h1>
          <p className="text-sm text-gray-500 dark:text-slate-400">
            Monitor and manage permit validity in real time
          </p>
        </div>
      </div>

      {/* Header Actions */}
      <div className="flex items-center gap-3">
        {/* Hidden File Input for CSV */}
        <input
          type="file"
          ref={fileInputRef}
          accept=".csv,text/csv"
          className="hidden"
          onChange={handleFileChange}
        />

        <button
          disabled={isImporting}
          onClick={() => fileInputRef.current?.click()}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 dark:text-slate-200 dark:bg-slate-800 dark:border-slate-700 dark:hover:bg-slate-700 flex items-center gap-2 transition-all cursor-pointer shadow-xs disabled:opacity-50"
        >
          {isImporting ? (
            <Loader2 className="w-4 h-4 animate-spin text-gray-500 dark:text-slate-300" />
          ) : (
            <Upload className="w-4 h-4" />
          )}
          <span>{isImporting ? 'Importing...' : 'Import CSV'}</span>
        </button>

        <button
          onClick={onExportCSV}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 dark:text-slate-200 dark:bg-slate-800 dark:border-slate-700 dark:hover:bg-slate-700 flex items-center gap-2 transition-all cursor-pointer shadow-xs"
        >
          <Download className="w-4 h-4" />
          <span>Export CSV</span>
        </button>

        <button
          onClick={onAddPermit}
          className="px-4 py-2 text-sm font-medium text-white bg-brand-600 border border-transparent rounded-md hover:bg-brand-700 dark:text-white dark:bg-indigo-600 dark:hover:bg-indigo-500 flex items-center gap-2 transition-all cursor-pointer shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Add Permit</span>
        </button>

        {/* Profile Button and Dropdown Pop-up */}
        <div className="relative ml-1">
          <button
            onClick={() => setIsProfileOpen((prev) => !prev)}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-500 dark:text-slate-300 hover:ring-2 hover:ring-brand-500 dark:hover:ring-indigo-500 focus:outline-none transition-all cursor-pointer"
            aria-label="User profile menu"
          >
            <User className="w-4 h-4" />
          </button>

          <ProfileDropdown
            isOpen={isProfileOpen}
            onClose={() => setIsProfileOpen(false)}
            onExport={onExportCSV}
            onAddPermit={onAddPermit}
          />
        </div>
      </div>
    </header>
  );
};
