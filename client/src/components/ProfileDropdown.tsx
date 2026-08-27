import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { Moon, Sun, User, LogOut, UserX, Loader2 } from 'lucide-react';
import { DeleteConfirmModal } from './DeleteConfirmModal';

interface ProfileDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  onExport?: () => void;
  onAddPermit?: () => void;
}

export const ProfileDropdown: React.FC<ProfileDropdownProps> = ({
  isOpen,
  onClose,
}) => {
  const { theme, toggleTheme } = useTheme();
  const { user, username, signOut, deleteAccount } = useAuth();
  const [isDeletingUser, setIsDeletingUser] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const displayName = username || user?.user_metadata?.username || user?.email?.split('@')[0] || '';

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

  const handleConfirmDeleteAccount = async () => {
    try {
      setIsDeletingUser(true);
      await deleteAccount();
      setIsConfirmOpen(false);
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
      className="absolute right-0 mt-3 w-72 bg-popover text-popover-foreground border border-border rounded-xl shadow-2xl z-50 p-4 transition-colors duration-200 select-none"
      style={{ backgroundColor: 'var(--popover)' }}
    >
      {/* User Info Header */}
      <div className="flex items-center gap-3 pb-3 border-b border-border">
        <div className="w-10 h-10 rounded-full bg-muted text-primary flex items-center justify-center border border-border shrink-0 font-bold">
          {displayName ? displayName.charAt(0).toUpperCase() : <User className="w-4 h-4" />}
        </div>
        <div className="overflow-hidden">
          <div className="text-sm font-semibold text-foreground truncate">
            {displayName || 'Permit User'}
          </div>
          <div className="text-[11px] text-primary truncate font-mono mt-0.5">
            {user?.email || 'authenticated'}
          </div>
        </div>
      </div>

      {/* Theme Mode Switcher */}
      <div className="py-3.5 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-medium text-foreground">
            {theme === 'dark' ? (
              <Moon className="w-4 h-4 text-primary" />
            ) : (
              <Sun className="w-4 h-4 text-amber-500" />
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
            <div className="w-11 h-6 bg-input peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
          </label>
        </div>
        <div className="flex items-center justify-between text-xs text-muted-foreground mt-2 pl-6">
          <span>Theme preference</span>
          <span className="font-semibold text-foreground capitalize px-2 py-0.5 rounded bg-muted border border-border">
            {theme} Mode
          </span>
        </div>
      </div>

      {/* Account Actions */}
      <div className="pt-2 space-y-1">
        <button
          onClick={async () => {
            onClose();
            await signOut();
          }}
          className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-popover-foreground hover:bg-muted rounded-lg transition-colors text-left cursor-pointer"
        >
          <LogOut className="w-4 h-4 text-muted-foreground" />
          <span>Sign Out</span>
        </button>

        <button
          onClick={() => setIsConfirmOpen(true)}
          disabled={isDeletingUser}
          className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-destructive hover:bg-destructive/10 rounded-lg transition-colors text-left mt-1 cursor-pointer disabled:opacity-50"
        >
          {isDeletingUser ? (
            <Loader2 className="w-4 h-4 text-destructive animate-spin" />
          ) : (
            <UserX className="w-4 h-4 text-destructive" />
          )}
          <span>{isDeletingUser ? 'Deleting Account...' : 'Delete Account'}</span>
        </button>
      </div>

      <DeleteConfirmModal
        isOpen={isConfirmOpen}
        title="Delete Account"
        description="Are you sure you want to permanently delete your account and all associated permit data? This action cannot be undone."
        confirmKeyword="DELETE"
        confirmButtonText="Delete Account"
        isDeleting={isDeletingUser}
        onConfirm={handleConfirmDeleteAccount}
        onClose={() => setIsConfirmOpen(false)}
      />
    </div>
  );
};
