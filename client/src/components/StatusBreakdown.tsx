import React from 'react';
import { StatusCounts } from '../types/permit';

interface StatusBreakdownProps {
  counts: StatusCounts;
}

export const StatusBreakdown: React.FC<StatusBreakdownProps> = ({ counts }) => {
  const { total, green, amber, orange, rose, gray } = counts;

  const rosePct = total > 0 ? (rose / total) * 100 : 0;
  const orangePct = total > 0 ? (orange / total) * 100 : 0;
  const amberPct = total > 0 ? (amber / total) * 100 : 0;
  const greenPct = total > 0 ? (green / total) * 100 : 0;
  const grayPct = total > 0 ? (gray / total) * 100 : 0;

  return (
    <section className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-lg p-5 shadow-sm transition-colors">
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">
          Status Breakdown
        </span>
        <span className="text-xs text-gray-400 dark:text-slate-500 font-mono">
          {total} permit{total !== 1 ? 's' : ''}
        </span>
      </div>
      <div className="h-3 w-full bg-gray-200 dark:bg-slate-800 rounded-full flex overflow-hidden">
        <div
          className="bg-rose-500 h-full transition-all duration-300"
          style={{ width: `${rosePct}%` }}
          title={`Expired: ${rose} (${Math.round(rosePct)}%)`}
        />
        <div
          className="bg-orange-500 h-full transition-all duration-300"
          style={{ width: `${orangePct}%` }}
          title={`Critical: ${orange} (${Math.round(orangePct)}%)`}
        />
        <div
          className="bg-amber-500 h-full transition-all duration-300"
          style={{ width: `${amberPct}%` }}
          title={`Expiring Soon: ${amber} (${Math.round(amberPct)}%)`}
        />
        <div
          className="bg-emerald-500 h-full transition-all duration-300"
          style={{ width: `${greenPct}%` }}
          title={`Safe: ${green} (${Math.round(greenPct)}%)`}
        />
        <div
          className="bg-gray-300 dark:bg-slate-700 h-full transition-all duration-300"
          style={{ width: `${grayPct}%` }}
          title={`No Date: ${gray} (${Math.round(grayPct)}%)`}
        />
      </div>
    </section>
  );
};
