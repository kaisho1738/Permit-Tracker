import React, { useState } from 'react';
import { usePermits } from './hooks/usePermits';
import { Header } from './components/Header';
import { StatCards } from './components/StatCards';
import { StatusBreakdown } from './components/StatusBreakdown';
import { TableControls } from './components/TableControls';
import { PermitTable } from './components/PermitTable';
import { NextToExpireSidebar } from './components/NextToExpireSidebar';
import { PermitModal } from './components/PermitModal';
import { Toast } from './components/Toast';
import { exportPermitsToCSV } from './utils/csvUtils';
import { Permit } from './types/permit';

export const App: React.FC = () => {
  const {
    permits,
    filteredPermits,
    upcomingPermits,
    statusCounts,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    sortField,
    sortDir,
    toggleSort,
    addPermit,
    updatePermit,
    deletePermit,
    importCSVData,
  } = usePermits();

  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    permit: Permit | null;
  }>({
    isOpen: false,
    permit: null,
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2500);
  };

  const handleOpenAddModal = () => {
    setModalState({ isOpen: true, permit: null });
  };

  const handleOpenEditModal = (permit: Permit) => {
    setModalState({ isOpen: true, permit });
  };

  const handleCloseModal = () => {
    setModalState({ isOpen: false, permit: null });
  };

  const handleSavePermit = (data: Omit<Permit, 'id'>) => {
    if (modalState.permit) {
      updatePermit(modalState.permit.id, data);
      showToast('Permit updated successfully');
    } else {
      addPermit(data);
      showToast('New permit added');
    }
  };

  const handleDeletePermit = (id: number) => {
    if (window.confirm('Are you sure you want to remove this permit?')) {
      deletePermit(id);
      showToast('Permit removed');
    }
  };

  const handleExportCSV = () => {
    const success = exportPermitsToCSV(permits);
    if (success) {
      showToast('CSV exported successfully');
    } else {
      showToast('Nothing to export');
    }
  };

  const handleImportCSV = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = String(e.target?.result || '');
        const count = importCSVData(text);
        if (count > 0) {
          showToast(`Imported ${count} permit${count !== 1 ? 's' : ''}`);
        } else {
          showToast('No valid permit rows found in CSV');
        }
      } catch (err) {
        console.error('Import error:', err);
        showToast('Failed to import CSV: Invalid format');
      }
    };
    reader.onerror = () => showToast('Could not read file');
    reader.readAsText(file);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f9fafb] text-gray-800 dark:bg-background dark:text-on-surface transition-colors duration-200">
      {/* Header */}
      <Header
        onAddPermit={handleOpenAddModal}
        onExportCSV={handleExportCSV}
        onImportCSV={handleImportCSV}
      />

      {/* Main Content Dashboard */}
      <main className="flex-1 p-6 flex flex-col lg:flex-row gap-6 max-w-[1900px] w-full mx-auto">
        {/* Left Column (Stats, Breakdown & Table) */}
        <div className="flex-1 flex flex-col gap-6 min-w-0">
          {/* Summary Cards */}
          <StatCards
            counts={statusCounts}
            activeFilter={statusFilter}
            onSelectFilter={setStatusFilter}
          />

          {/* Distribution Bar */}
          <StatusBreakdown counts={statusCounts} />

          {/* Table Container */}
          <section className="bg-white dark:bg-surface-container border border-gray-200 dark:border-outline-variant rounded-lg shadow-sm flex-1 flex flex-col overflow-hidden transition-colors">
            {/* Search & Filters */}
            <TableControls
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              statusFilter={statusFilter}
              onStatusFilterChange={setStatusFilter}
              counts={statusCounts}
              totalFiltered={filteredPermits.length}
            />

            {/* Main Table */}
            <PermitTable
              permits={filteredPermits}
              sortField={sortField}
              sortDir={sortDir}
              onSort={toggleSort}
              onEditPermit={handleOpenEditModal}
              onDeletePermit={handleDeletePermit}
              onOpenAddModal={handleOpenAddModal}
            />
          </section>
        </div>

        {/* Right Sidebar (Next to Expire) */}
        <NextToExpireSidebar
          upcomingPermits={upcomingPermits}
          onSelectFilter={setStatusFilter}
        />
      </main>

      {/* Add / Edit Modal */}
      <PermitModal
        isOpen={modalState.isOpen}
        permit={modalState.permit}
        onClose={handleCloseModal}
        onSave={handleSavePermit}
      />

      {/* Toast Feedback */}
      <Toast message={toastMessage} />
    </div>
  );
};
