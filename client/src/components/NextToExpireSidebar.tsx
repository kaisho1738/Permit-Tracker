import React, { useState, useMemo, useEffect } from 'react';
import { Permit, FilterStatus } from '../types/permit';
import { getMonthsDiff, getStatus, getStatusMeta, formatDateDisplay, getRemarks } from '../utils/dateUtils';
import { Clock, X, AlertTriangle, ChevronRight, Calendar, Building2, ShieldAlert, RotateCcw, Filter } from 'lucide-react';

interface NextToExpireSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  permits: Permit[];
  onSelectFilter: (filter: FilterStatus) => void;
}

export const NextToExpireSidebar: React.FC<NextToExpireSidebarProps> = ({
  isOpen,
  onClose,
  permits = [],
  onSelectFilter,
}) => {
  // Default target date: 90 days (approx 3 months) from today
  const getDefaultDate = () => {
    const d = new Date();
    d.setDate(d.getDate() + 90);
    return d.toISOString().split('T')[0];
  };

  const [targetDate, setTargetDate] = useState<string>(getDefaultDate);

  // Close drawer on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Prevent background body scroll when drawer is open
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

  const getFutureDateStr = (days: number) => {
    const d = new Date();
    d.setDate(d.getDate() + days);
    return d.toISOString().split('T')[0];
  };

  const presets = [
    { label: '30 Days', days: 30 },
    { label: '60 Days', days: 60 },
    { label: '90 Days', days: 90 },
    { label: '6 Months', days: 180 },
    { label: '1 Year', days: 365 },
  ];

  // Filter permits expiring on or before targetDate
  const expiringPermits = useMemo(() => {
    if (!targetDate) return [];
    const targetTime = new Date(targetDate).setHours(23, 59, 59, 999);

    return permits
      .filter((p) => {
        if (!p.expiry) return false;
        const expTime = new Date(p.expiry).getTime();
        return !isNaN(expTime) && expTime <= targetTime;
      })
      .map((p) => {
        const months = getMonthsDiff(p.expiry);
        return {
          permit: p,
          months,
          status: getStatus(months),
          remarks: getRemarks(months),
        };
      })
      .sort((a, b) => new Date(a.permit.expiry).getTime() - new Date(b.permit.expiry).getTime());
  }, [permits, targetDate]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-background/80 backdrop-blur-xs transition-opacity duration-300 animate-in fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide-Over Drawer Container */}
      <aside
        className="relative z-50 w-full sm:max-w-lg bg-card text-card-foreground border-l border-border shadow-2xl flex flex-col h-full overflow-hidden animate-in slide-in-from-right duration-300 ease-out"
        role="dialog"
        aria-modal="true"
        aria-labelledby="slideover-title"
      >
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-border bg-muted/30 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 id="slideover-title" className="text-base font-semibold text-foreground truncate">
                  Expiring Permits
                </h2>
                <span className="text-xs bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded-full font-mono font-medium">
                  {expiringPermits.length}
                </span>
              </div>
              <p className="text-xs text-muted-foreground truncate">
                Monitor permits expiring within your selected timeframe
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/40"
            title="Close drawer (Esc)"
            aria-label="Close drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Date Filter Controls */}
        <div className="p-4 sm:p-5 border-b border-border bg-muted/15 space-y-3 shrink-0">
          <div className="flex items-center justify-between">
            <label htmlFor="expiring-date-picker" className="text-xs font-semibold text-foreground flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-primary" />
              <span>Expiring in / on or before:</span>
            </label>
            <button
              type="button"
              onClick={() => setTargetDate(getDefaultDate())}
              className="text-[11px] text-muted-foreground hover:text-primary flex items-center gap-1 cursor-pointer transition-colors"
              title="Reset to 90 days default"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset (90d)</span>
            </button>
          </div>

          <div className="relative">
            <input
              id="expiring-date-picker"
              type="date"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
              className="w-full px-3.5 py-2 text-sm bg-background border border-input rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all font-mono font-medium shadow-xs"
            />
          </div>

          {/* Quick Preset Buttons */}
          <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
            <span className="text-[11px] text-muted-foreground mr-1 flex items-center gap-1">
              <Filter className="w-3 h-3" /> Quick:
            </span>
            {presets.map((preset) => {
              const presetDate = getFutureDateStr(preset.days);
              const isActive = targetDate === presetDate;
              return (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => setTargetDate(presetDate)}
                  className={`px-2.5 py-1 text-xs rounded-md border transition-all cursor-pointer font-medium ${isActive
                      ? 'bg-primary text-primary-foreground border-primary shadow-xs'
                      : 'bg-card text-muted-foreground hover:text-foreground border-border hover:bg-muted'
                    }`}
                >
                  {preset.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Drawer Body / Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
          {expiringPermits.length === 0 ? (
            <div className="text-center py-16 px-4 flex flex-col items-center justify-center">
              <ShieldAlert className="w-10 h-10 text-muted-foreground/60 mb-3" />
              <h3 className="text-sm font-semibold text-foreground mb-1">No Permits Expiring</h3>
              <p className="text-xs text-muted-foreground max-w-xs">
                No permits found with expiry dates on or before{' '}
                <strong className="text-foreground">{formatDateDisplay(targetDate)}</strong>.
              </p>
            </div>
          ) : (
            <div className="space-y-2.5">
              <div className="text-[11px] font-medium text-muted-foreground flex items-center justify-between px-0.5">
                <span>Found {expiringPermits.length} permit{expiringPermits.length !== 1 ? 's' : ''}</span>
                <span>Sorted by closest expiry</span>
              </div>

              {expiringPermits.map(({ permit, status, remarks }) => {
                const meta = getStatusMeta(status);
                const dateStr = formatDateDisplay(permit.expiry);

                return (
                  <div
                    key={permit.id}
                    onClick={() => {
                      onSelectFilter(status as FilterStatus);
                      onClose();
                    }}
                    title={`Filter by ${meta.label}`}
                    className="p-3.5 rounded-xl border border-border bg-card hover:border-primary/50 hover:bg-muted/40 transition-all cursor-pointer shadow-2xs group flex flex-col gap-2 relative overflow-hidden"
                  >
                    {/* Status vertical accent indicator */}
                    <div
                      className={`absolute top-0 left-0 bottom-0 w-1 ${status === 'rose'
                          ? 'bg-rose-500'
                          : status === 'orange'
                            ? 'bg-orange-500'
                            : status === 'amber'
                              ? 'bg-amber-500'
                              : status === 'green'
                                ? 'bg-emerald-500'
                                : 'bg-muted-foreground'
                        }`}
                    />

                    {/* Top Row: Company Name & Status Badge */}
                    <div className="flex items-start justify-between gap-2 pl-1.5">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-0.5">
                          <Building2 className="w-3.5 h-3.5 shrink-0" />
                          <span className="font-medium truncate">{permit.plant || 'Untitled Plant'}</span>
                        </div>
                        <h4 className="text-sm font-bold text-foreground truncate group-hover:text-primary transition-colors">
                          {permit.permit || 'Permit'}
                        </h4>
                      </div>

                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border shrink-0 ${meta.badgeClass}`}
                      >
                        <div className={`w-1.5 h-1.5 rounded-full ${meta.dotClass} mr-1.5`} />
                        {meta.label}
                      </span>
                    </div>

                    {/* Countdown / Relative text banner */}
                    <div className="pl-1.5 text-xs font-semibold text-primary flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 shrink-0" />
                      <span>{remarks}</span>
                    </div>

                    {/* Details: Environmental Law & Expiry */}
                    <div className="pl-1.5 flex items-center justify-between text-xs text-muted-foreground pt-1 border-t border-border/50">
                      <span className="truncate max-w-[200px]">
                        {permit.environmental_law || ''}
                      </span>
                      <div className="flex items-center gap-1 shrink-0 font-medium text-foreground">
                        <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                        <span>{dateStr}</span>
                      </div>
                    </div>

                    {/* Quick Action Hint */}
                    <div className="pl-1.5 flex items-center justify-end text-[11px] text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                      <span>Filter in table</span>
                      <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Drawer Footer */}
        {expiringPermits.length > 0 && (
          <div className="p-3.5 sm:p-4 border-t border-border bg-muted/20 flex items-center justify-between text-xs text-muted-foreground shrink-0">
            <span className="flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
              <span>{expiringPermits.length} permit{expiringPermits.length !== 1 ? 's' : ''} expiring by {formatDateDisplay(targetDate)}</span>
            </span>
            <button
              onClick={onClose}
              className="text-xs font-medium text-foreground hover:text-primary hover:underline cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        )}
      </aside>
    </div>
  );
};



