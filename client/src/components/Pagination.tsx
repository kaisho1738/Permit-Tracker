import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
}) => {
  if (totalItems === 0) return null;

  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  // Generate page numbers to show
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 4) {
        pages.push(1, 2, 3, 4, 5, '...', totalPages);
      } else if (currentPage >= totalPages - 3) {
        pages.push(1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }
    return pages;
  };

  const pages = getPageNumbers();

  return (
    <div className="px-4 py-3 border-t border-gray-200 dark:border-slate-800 bg-[#fbfbfa] dark:bg-slate-900/60 flex items-center justify-between flex-wrap gap-3 transition-colors">
      {/* Range Info */}
      <div className="text-xs sm:text-sm text-gray-500 dark:text-slate-400">
        Showing <span className="font-semibold text-gray-900 dark:text-slate-100">{startItem}</span> to{' '}
        <span className="font-semibold text-gray-900 dark:text-slate-100">{endItem}</span> of{' '}
        <span className="font-semibold text-gray-900 dark:text-slate-100">{totalItems}</span> permits
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center gap-1">
        {/* First Page */}
        {totalPages > 5 && (
          <button
            onClick={() => onPageChange(1)}
            disabled={currentPage === 1}
            className="p-1.5 rounded-md text-gray-600 dark:text-slate-400 hover:bg-gray-200/70 dark:hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent dark:disabled:hover:bg-transparent disabled:cursor-not-allowed transition-colors"
            title="First Page"
            aria-label="First page"
          >
            <ChevronsLeft className="w-4 h-4" />
          </button>
        )}

        {/* Previous */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-1.5 rounded-md text-gray-600 dark:text-slate-400 hover:bg-gray-200/70 dark:hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent dark:disabled:hover:bg-transparent disabled:cursor-not-allowed transition-colors"
          title="Previous Page"
          aria-label="Previous page"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Numbered Page Buttons */}
        <div className="flex items-center gap-1 mx-1">
          {pages.map((p, idx) => {
            if (p === '...') {
              return (
                <span
                  key={`ellipsis-${idx}`}
                  className="px-2 py-1 text-xs text-gray-400 dark:text-slate-500 select-none"
                >
                  ...
                </span>
              );
            }

            const pageNum = Number(p);
            const isActive = pageNum === currentPage;

            return (
              <button
                key={pageNum}
                onClick={() => onPageChange(pageNum)}
                className={`min-w-[32px] h-8 px-2 text-xs sm:text-sm font-medium rounded-md transition-all cursor-pointer ${
                  isActive
                    ? 'bg-brand-600 text-white dark:bg-indigo-600 dark:text-white shadow-xs font-semibold'
                    : 'text-gray-700 hover:bg-gray-200/70 dark:text-slate-300 dark:hover:bg-slate-800'
                }`}
                aria-label={`Page ${pageNum}`}
                aria-current={isActive ? 'page' : undefined}
              >
                {pageNum}
              </button>
            );
          })}
        </div>

        {/* Next */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-1.5 rounded-md text-gray-600 dark:text-slate-400 hover:bg-gray-200/70 dark:hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent dark:disabled:hover:bg-transparent disabled:cursor-not-allowed transition-colors"
          title="Next Page"
          aria-label="Next page"
        >
          <ChevronRight className="w-4 h-4" />
        </button>

        {/* Last Page */}
        {totalPages > 5 && (
          <button
            onClick={() => onPageChange(totalPages)}
            disabled={currentPage === totalPages}
            className="p-1.5 rounded-md text-gray-600 dark:text-slate-400 hover:bg-gray-200/70 dark:hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent dark:disabled:hover:bg-transparent disabled:cursor-not-allowed transition-colors"
            title="Last Page"
            aria-label="Last page"
          >
            <ChevronsRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
