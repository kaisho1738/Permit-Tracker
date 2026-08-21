import React from 'react';
import { StatusCounts } from '../types/permit';

interface StatusBreakdownProps {
  counts: StatusCounts;
}

export const StatusBreakdown: React.FC<StatusBreakdownProps> = ({ counts }) => {
  const { total, green, amber, red, gray } = counts;

  const redPct = total > 0 ? (red / total) * 100 : 0;
  const amberPct = total > 0 ? (amber / total) * 100 : 0;
  const greenPct = total > 0 ? (green / total) * 100 : 0;
  const grayPct = total > 0 ? (gray / total) * 100 : 0;

  return (
    <section className="bg-white dark:bg-surface-container border border-gray-200 dark:border-outline-variant rounded-lg p-5 shadow-sm transition-colors">
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs font-semibold text-gray-500 dark:text-on-surface-variant uppercase tracking-wider">
          Status Breakdown
        </span>
        <span className="text-xs text-gray-400 dark:text-on-surface-variant font-mono">
          {total} permit{total !== 1 ? 's' : ''}
        </span>
      </div>
      <div className="h-3 w-full bg-gray-200 dark:bg-surface-container-highest rounded-full flex overflow-hidden">
        <div
          className="bg-danger-500 dark:bg-error h-full transition-all duration-300"
          style={{ width: `${redPct}%` }}
          title={`Critical / Expired: ${red} (${Math.round(redPct)}%)`}
        />
        <div
          className="bg-warning-500 dark:bg-warning h-full transition-all duration-300"
          style={{ width: `${amberPct}%` }}
          title={`Expiring Soon: ${amber} (${Math.round(amberPct)}%)`}
        />
        <div
          className="bg-success-500 dark:bg-success h-full transition-all duration-300"
          style={{ width: `${greenPct}%` }}
          title={`Safe: ${green} (${Math.round(greenPct)}%)`}
        />
        <div
          className="bg-gray-300 dark:bg-outline-variant h-full transition-all duration-300"
          style={{ width: `${grayPct}%` }}
          title={`No Date: ${gray} (${Math.round(grayPct)}%)`}
        />
      </div>
    </section>
  );
};
