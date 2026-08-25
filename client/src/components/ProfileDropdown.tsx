import React, { useRef, useEffect, useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { Moon, Sun, Download, Plus, ShieldCheck, User, LogOut, UserX, Loader2 } from 'lucide-react';

interface ProfileDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: () => void;
  onAddPermit: () => void;
}

export const ProfileDropdown: React.FC<ProfileDropdownProps> = ({
  isOpen,
  onClose,
  onExport,
  onAddPermit,
}) => {
  const { theme, toggleTheme } = useTheme();
  const { user, username, signOut, deleteAccount } = useAuth();
  const [isDeletingUser, setIsDeletingUser] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
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

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      'Are you sure you want to permanently delete your account and all associated permit data? This action cannot be undone.'
    );
    if (!confirmed) return;

    try {
      setIsDeletingUser(true);
      await deleteAccount();
      onClose();
    } catch (err: any) {
      alert(err.message || 'Failed to delete account.');
    } finally {
      setIsDeletingUser(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      ref={dropdownRef}
      className="absolute right-0 mt-3 w-72 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl shadow-xl z-50 p-4 transition-all duration-200 animate-in fade-in slide-in-from-top-2 text-gray-900 dark:text-slate-100"
    >
      {/* User Info Header */}
      <div className="flex items-center gap-3 pb-3 border-b border-gray-100 dark:border-slate-800">
        <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-slate-300 flex items-center justify-center border border-gray-200 dark:border-slate-700 shrink-0 font-bold text-indigo-600 dark:text-indigo-400">
          {username ? username.charAt(0).toUpperCase() : <User className="w-4 h-4" />}
        </div>
        <div className="overflow-hidden">
          <div className="text-sm font-semibold text-gray-900 dark:text-slate-100 truncate">
            {username || 'Permit User'}
          </div>
          <div className="text-[11px] text-brand-600 dark:text-indigo-400 truncate font-mono mt-0.5">
            {user?.email || 'authenticated'}
          </div>
        </div>
      </div>

      {/* Theme Mode Switcher */}
      <div className="py-3.5 border-b border-gray-100 dark:border-slate-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-slate-200">
            {theme === 'dark' ? (
              <Moon className="w-4 h-4 text-indigo-400" />
            ) : (
              <Sun className="w-4 h-4 text-brand-600" />
            )}
            <span>Dark Mode</span>
          </div>

          {/* Switch toggle */}
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={theme === 'dark'}
              onChange={toggleTheme}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-slate-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-600 dark:peer-checked:bg-indigo-600"></div>
          </label>
        </div>
        <div className="flex items-center justify-between text-xs text-gray-400 dark:text-slate-400 mt-1.5 pl-6">
          <span>Theme preference</span>
          <span className="font-medium text-gray-600 dark:text-slate-300 capitalize">
            {theme} Mode
          </span>
        </div>
      </div>

      {/* Quick Actions Menu */}
      <div className="pt-2 space-y-1">
        <button
          onClick={() => {
            onExport();
            onClose();
          }}
          className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-gray-700 dark:text-slate-300 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors text-left cursor-pointer"
        >
          <Download className="w-4 h-4 text-gray-400 dark:text-slate-400" />
          <span>Export All Permit Data</span>
        </button>
        <button
          onClick={() => {
            onAddPermit();
            onClose();
          }}
          className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-gray-700 dark:text-slate-300 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors text-left cursor-pointer"
        >
          <Plus className="w-4 h-4 text-gray-400 dark:text-slate-400" />
          <span>Create New Permit Entry</span>
        </button>

        <button
          onClick={async () => {
            onClose();
            await signOut();
          }}
          className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-100 dark:text-slate-300 dark:hover:bg-slate-800 rounded-lg transition-colors text-left mt-1 cursor-pointer"
        >
          <LogOut className="w-4 h-4 text-gray-500 dark:text-slate-400" />
          <span>Sign Out</span>
        </button>

        <button
          onClick={handleDeleteAccount}
          disabled={isDeletingUser}
          className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/40 rounded-lg transition-colors text-left mt-1 cursor-pointer disabled:opacity-50"
        >
          {isDeletingUser ? (
            <Loader2 className="w-4 h-4 text-rose-500 animate-spin" />
          ) : (
            <UserX className="w-4 h-4 text-rose-500" />
          )}
          <span>{isDeletingUser ? 'Deleting Account...' : 'Delete Account'}</span>
        </button>

        <div className="pt-1.5 text-[11px] text-gray-400 dark:text-slate-500 flex items-center justify-center gap-1 border-t border-gray-100 dark:border-slate-800 mt-2">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>Permity v1.2</span>
        </div>
      </div>
    </div>
  );
};


