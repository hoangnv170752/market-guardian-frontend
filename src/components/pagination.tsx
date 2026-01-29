'use client';

import { useCallback, useMemo } from 'react';
import { Icon } from '@iconify/react';

interface PaginationProps {
  total: number;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  pageSizeOptions?: number[];
}

export const Pagination = ({
  total,
  currentPage,
  pageSize,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 20, 50, 100],
}: PaginationProps) => {
  const totalPages = useMemo(() => Math.ceil(total / pageSize), [total, pageSize]);

  const handleFirst = useCallback(() => {
    if (currentPage > 1) {
      onPageChange(1);
    }
  }, [currentPage, onPageChange]);

  const handlePrevious = useCallback(() => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  }, [currentPage, onPageChange]);

  const handleNext = useCallback(() => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  }, [currentPage, totalPages, onPageChange]);

  const handleLast = useCallback(() => {
    if (currentPage < totalPages) {
      onPageChange(totalPages);
    }
  }, [currentPage, totalPages, onPageChange]);

  return (
    <div className="flex items-center justify-between border-t border-gray-200 bg-white px-6 py-3">
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-700">
          Total <span className="font-semibold">{total}</span>
        </span>

        <div className="h-6 w-px bg-gray-300" />

        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-700">Show</span>
          <div className="relative">
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className="appearance-none rounded border border-gray-300 bg-white px-3 py-1 pr-8 text-sm focus:border-primary-main focus:outline-none focus:ring-1 focus:ring-primary-main"
            >
              {pageSizeOptions.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
            <Icon
              icon="mdi:chevron-down"
              className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500"
            />
          </div>
        </div>

        <span className="text-sm text-gray-700">
          page {currentPage} of {totalPages}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={handleFirst}
          disabled={currentPage === 1}
          className="rounded p-2 text-gray-600 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent"
          title="First page"
        >
          <Icon icon="mdi:chevron-double-left" className="h-5 w-5" />
        </button>

        <button
          onClick={handlePrevious}
          disabled={currentPage === 1}
          className="rounded p-2 text-gray-600 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent"
          title="Previous page"
        >
          <Icon icon="mdi:chevron-left" className="h-5 w-5" />
        </button>

        <button
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className="rounded p-2 text-gray-600 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent"
          title="Next page"
        >
          <Icon icon="mdi:chevron-right" className="h-5 w-5" />
        </button>

        <button
          onClick={handleLast}
          disabled={currentPage === totalPages}
          className="rounded p-2 text-gray-600 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent"
          title="Last page"
        >
          <Icon icon="mdi:chevron-double-right" className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};
