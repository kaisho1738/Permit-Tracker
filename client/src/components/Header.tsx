import React, { useState, useRef, useEffect } from 'react';
import { FileText, Upload, Download, Plus, User, Loader2, MoreVertical, Bell, ChevronDown, FileSpreadsheet } from 'lucide-react';
import { ProfileDropdown } from './ProfileDropdown';

interface HeaderProps {
  isImporting?: boolean;
  onAddPermit: () => void;
  onExportCSV: () => void;
  onImportCSV: (file: File) => void;
  onOpenNextToExpire: () => void;
  upcomingCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  isImporting = false,
  onAddPermit,
  onExportCSV,
  onImportCSV,
  onOpenNextToExpire,
  upcomingCount = 0,
}) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileActionsOpen, setIsMobileActionsOpen] = useState(false);
  const [isCsvDropdownOpen, setIsCsvDropdownOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mobileActionsRef = useRef<HTMLDivElement>(null);
  const csvDropdownRef = useRef<HTMLDivElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImportCSV(file);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        mobileActionsRef.current &&
        !mobileActionsRef.current.contains(target)
      ) {
        setIsMobileActionsOpen(false);
      }
      if (
        csvDropdownRef.current &&
        !csvDropdownRef.current.contains(target)
      ) {
        setIsCsvDropdownOpen(false);
      }
    };

    if (isMobileActionsOpen || isCsvDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobileActionsOpen, isCsvDropdownOpen]);

  return (
    <header className="bg-card text-card-foreground border-b border-border px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between sticky top-0 z-20 transition-colors duration-200 shadow-xs gap-2">
      {/* Title & Logo */}
      <div className="flex items-center gap-3 sm:gap-4 min-w-0">
        <div className="w-9 h-9 sm:w-10 sm:h-10 bg-accent border border-border rounded-lg flex items-center justify-center text-primary transition-colors shadow-xs shrink-0">
          <FileText className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <h1 className="text-lg sm:text-xl font-semibold text-foreground tracking-tight truncate">
            Permity
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground hidden sm:block truncate">
            Monitor and manage permit validity in real time
          </p>
        </div>
      </div>

      {/* Header Actions */}
      <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
        {/* Hidden File Input for CSV */}
        <input
          type="file"
          ref={fileInputRef}
          accept=".csv,text/csv"
          className="hidden"
          onChange={handleFileChange}
        />

        {/* Desktop Action Buttons */}
        <div className="hidden sm:flex items-center gap-2 sm:gap-3">
          {/* Merged CSV Dropdown Button */}
          <div className="relative" ref={csvDropdownRef}>
            <button
              disabled={isImporting}
              onClick={() => setIsCsvDropdownOpen((prev) => !prev)}
              title="Import or Export CSV data"
              className="px-3 sm:px-4 py-2 text-sm font-medium text-foreground bg-card border border-input rounded-md hover:bg-muted flex items-center gap-2 transition-all cursor-pointer shadow-xs disabled:opacity-50 group"
              aria-expanded={isCsvDropdownOpen}
            >
              {isImporting ? (
                <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
              ) : (
                <FileSpreadsheet className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
              )}
              <span>{isImporting ? 'Importing...' : 'CSV'}</span>
              <ChevronDown
                className={`w-3.5 h-3.5 text-muted-foreground transition-transform duration-200 ${
                  isCsvDropdownOpen ? 'rotate-180 text-foreground' : ''
                }`}
              />
            </button>

            {/* CSV Dropdown Menu */}
            {isCsvDropdownOpen && (
              <div className="absolute left-0 mt-2 w-44 bg-popover text-popover-foreground border border-border rounded-lg shadow-xl z-50 p-1.5 animate-in fade-in zoom-in-95 duration-100 text-xs">
                <button
                  disabled={isImporting}
                  onClick={() => {
                    setIsCsvDropdownOpen(false);
                    fileInputRef.current?.click();
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 font-medium text-popover-foreground rounded-md hover:bg-muted transition-colors text-left cursor-pointer disabled:opacity-50"
                >
                  <Upload className="w-4 h-4 text-muted-foreground" />
                  <span>Import CSV</span>
                </button>

                <button
                  onClick={() => {
                    setIsCsvDropdownOpen(false);
                    onExportCSV();
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 font-medium text-popover-foreground rounded-md hover:bg-muted transition-colors text-left cursor-pointer"
                >
                  <Download className="w-4 h-4 text-muted-foreground" />
                  <span>Export CSV</span>
                </button>
              </div>
            )}
          </div>

          {/* Next to Expire Drawer Trigger */}
          <button
            onClick={onOpenNextToExpire}
            title="View expiring permits"
            className="px-3 sm:px-4 py-2 text-sm font-medium text-foreground bg-card border border-input hover:border-primary/50 rounded-md hover:bg-muted flex items-center gap-2 transition-all cursor-pointer shadow-xs relative group"
          >
            <Bell className="w-4 h-4 text-primary group-hover:scale-110 transition-transform" />
            <span>Next to Expire</span>
            <span className="text-xs bg-primary/10 text-primary border border-primary/20 px-1.5 py-0.5 rounded-full font-mono font-medium">
              {upcomingCount}
            </span>
          </button>

          <button
            onClick={onAddPermit}
            title="Add Permit"
            className="px-3 sm:px-4 py-2 text-sm font-medium text-primary-foreground bg-primary border border-transparent rounded-md hover:bg-primary/90 flex items-center gap-2 transition-all cursor-pointer shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Add Permit</span>
          </button>
        </div>

        {/* Mobile Action Dropdown Menu (< sm) */}
        <div className="relative sm:hidden" ref={mobileActionsRef}>
          <div className="flex items-center gap-1.5">
            {/* Mobile Next to Expire Trigger */}
            <button
              onClick={onOpenNextToExpire}
              title="Next to Expire"
              className="p-2 text-foreground bg-card border border-input rounded-md hover:bg-muted flex items-center justify-center cursor-pointer shadow-xs relative"
              aria-label="Next to Expire"
            >
              <Bell className="w-4 h-4 text-primary" />
              {upcomingCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 bg-primary text-primary-foreground text-[10px] font-bold rounded-full flex items-center justify-center">
                  {upcomingCount}
                </span>
              )}
            </button>

            {/* Primary Add Permit Button for Mobile */}
            <button
              onClick={onAddPermit}
              title="Add Permit"
              className="p-2 text-primary-foreground bg-primary rounded-md hover:bg-primary/90 flex items-center justify-center cursor-pointer shadow-xs"
              aria-label="Add Permit"
            >
              <Plus className="w-4 h-4" />
            </button>

            {/* Actions Trigger */}
            <button
              onClick={() => setIsMobileActionsOpen((prev) => !prev)}
              title="More Actions"
              className="p-2 text-foreground bg-card border border-input rounded-md hover:bg-muted flex items-center justify-center cursor-pointer shadow-xs"
              aria-label="More actions"
            >
              {isImporting ? (
                <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
              ) : (
                <MoreVertical className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Mobile Actions Dropdown Popup */}
          {isMobileActionsOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-popover text-popover-foreground border border-border rounded-lg shadow-xl z-50 p-1.5 transition-all text-xs">
              <button
                onClick={() => {
                  setIsMobileActionsOpen(false);
                  onOpenNextToExpire();
                }}
                className="w-full flex items-center justify-between px-3 py-2 font-medium text-popover-foreground rounded-md hover:bg-muted transition-colors text-left cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <Bell className="w-4 h-4 text-primary" />
                  <span>Next to Expire</span>
                </div>
                <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-full font-mono font-bold">
                  {upcomingCount}
                </span>
              </button>

              <button
                disabled={isImporting}
                onClick={() => {
                  setIsMobileActionsOpen(false);
                  fileInputRef.current?.click();
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 font-medium text-popover-foreground rounded-md hover:bg-muted transition-colors text-left cursor-pointer disabled:opacity-50"
              >
                {isImporting ? (
                  <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                ) : (
                  <Upload className="w-4 h-4 text-muted-foreground" />
                )}
                <span>Import CSV</span>
              </button>

              <button
                onClick={() => {
                  setIsMobileActionsOpen(false);
                  onExportCSV();
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 font-medium text-popover-foreground rounded-md hover:bg-muted transition-colors text-left cursor-pointer"
              >
                <Download className="w-4 h-4 text-muted-foreground" />
                <span>Export CSV</span>
              </button>

              <button
                onClick={() => {
                  setIsMobileActionsOpen(false);
                  onAddPermit();
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 font-medium text-primary rounded-md hover:bg-accent transition-colors text-left cursor-pointer border-t border-border mt-1 pt-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Add Permit</span>
              </button>
            </div>
          )}
        </div>

        {/* Profile Button and Dropdown Pop-up */}
        <div className="relative ml-0.5 sm:ml-1">
          <button
            onClick={() => setIsProfileOpen((prev) => !prev)}
            className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-muted border border-border text-muted-foreground hover:ring-2 hover:ring-ring focus:outline-none transition-all cursor-pointer"
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
