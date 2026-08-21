import React, { useState, useRef } from 'react';
import { FileText, Upload, Download, Plus, User } from 'lucide-react';
import { ProfileDropdown } from './ProfileDropdown';

interface HeaderProps {
  onAddPermit: () => void;
  onExportCSV: () => void;
  onImportCSV: (file: File) => void;
}

export const Header: React.FC<HeaderProps> = ({ onAddPermit, onExportCSV, onImportCSV }) => {
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
    <header className="bg-white dark:bg-surface-container border-b border-gray-200 dark:border-outline-variant px-6 py-4 flex items-center justify-between sticky top-0 z-20 transition-colors duration-200 shadow-sm">
      {/* Title & Logo */}
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 bg-brand-50 dark:bg-primary-container/20 rounded-lg flex items-center justify-center text-brand-600 dark:text-primary transition-colors shadow-xs">
          <FileText className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-xl font-semibold text-gray-900 dark:text-on-surface tracking-tight">
            Permit Tracker
          </h1>
          <p className="text-sm text-gray-500 dark:text-on-surface-variant">
            Monitor and manage powerplant permit validity in real time
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
          onClick={() => fileInputRef.current?.click()}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 dark:text-on-surface dark:bg-surface-container-high dark:border-outline dark:hover:bg-surface-container-highest flex items-center gap-2 transition-all cursor-pointer shadow-xs"
        >
          <Upload className="w-4 h-4" />
          <span>Import CSV</span>
        </button>

        <button
          onClick={onExportCSV}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 dark:text-on-surface dark:bg-surface-container-high dark:border-outline dark:hover:bg-surface-container-highest flex items-center gap-2 transition-all cursor-pointer shadow-xs"
        >
          <Download className="w-4 h-4" />
          <span>Export CSV</span>
        </button>

        <button
          onClick={onAddPermit}
          className="px-4 py-2 text-sm font-medium text-white bg-brand-600 border border-transparent rounded-md hover:bg-brand-700 dark:text-on-primary dark:bg-primary dark:hover:bg-primary/90 flex items-center gap-2 transition-all cursor-pointer shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Add Permit</span>
        </button>

        {/* Profile Button and Dropdown Pop-up */}
        <div className="relative ml-1">
          <button
            onClick={() => setIsProfileOpen((prev) => !prev)}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 dark:bg-surface-container-high border border-gray-200 dark:border-outline text-gray-500 dark:text-on-surface-variant hover:ring-2 hover:ring-brand-500 dark:hover:ring-primary focus:outline-none transition-all cursor-pointer"
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
