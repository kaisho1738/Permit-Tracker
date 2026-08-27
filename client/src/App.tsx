import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { AuthPage } from './pages/AuthPage';
import { usePermits } from './hooks/usePermits';
import { Header } from './components/Header';
import { StatCards } from './components/StatCards';
import { TableControls } from './components/TableControls';
import { PermitTable } from './components/PermitTable';
import { NextToExpireSidebar } from './components/NextToExpireSidebar';
import { PermitModal } from './components/PermitModal';
import { RemarksModal } from './components/RemarksModal';
import { SortModal } from './components/SortModal';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';
import { Toast } from './components/Toast';
import { Pagination } from './components/Pagination';
import { exportPermitsToCSV } from './utils/csvUtils';
import { Permit } from './types/permit';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center text-foreground">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm font-medium text-muted-foreground">Loading session...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

const Dashboard: React.FC = () => {
  const {
    permits,
    filteredPermits,
    paginatedPermits,
    upcomingPermits,
    statusCounts,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    sortField,
    sortDir,
    setSort,
    currentPage,
    setCurrentPage,
    totalPages,
    pageSize,
    addPermit,
    updatePermit,
    deletePermit,
    deletePermits,
    importCSVData,
    loading,
    isAdding,
    isUpdating,
    deletingId,
    isDeletingBatch,
    isImporting,
  } = usePermits();

  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    permit: Permit | null;
  }>({
    isOpen: false,
    permit: null,
  });

  const [remarksModalState, setRemarksModalState] = useState<{
    isOpen: boolean;
    permit: Permit | null;
  }>({
    isOpen: false,
    permit: null,
  });

  const [isSortModalOpen, setIsSortModalOpen] = useState(false);
  const [isNextToExpireOpen, setIsNextToExpireOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'table' | 'cards'>(() =>
    typeof window !== 'undefined' && window.innerWidth < 768 ? 'cards' : 'table'
  );
  const [selectedPermitIds, setSelectedPermitIds] = useState<number[]>([]);
  const [deleteModalState, setDeleteModalState] = useState<{
    isOpen: boolean;
    type: 'single' | 'batch';
    permitId?: number;
    permitName?: string;
    count?: number;
  }>({
    isOpen: false,
    type: 'single',
  });

  // Clear selection when view changes (filters, search, pagination)
  React.useEffect(() => {
    setSelectedPermitIds([]);
  }, [searchQuery, statusFilter, sortField, sortDir, currentPage]);

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
    setRemarksModalState({ isOpen: false, permit: null });
    setModalState({ isOpen: true, permit });
  };

  const handleCloseModal = () => {
    setModalState({ isOpen: false, permit: null });
  };

  const handleViewRemarks = (permit: Permit) => {
    setRemarksModalState({ isOpen: true, permit });
  };

  const handleCloseRemarksModal = () => {
    setRemarksModalState({ isOpen: false, permit: null });
  };

  const handleSavePermit = async (data: Omit<Permit, 'id' | 'permit_id'>) => {
    try {
      if (modalState.permit) {
        await updatePermit(modalState.permit.id, data);
        showToast('Permit updated successfully');
      } else {
        await addPermit(data);
        showToast('New permit added');
      }
      handleCloseModal();
    } catch (err: any) {
      showToast('Error saving permit: ' + err.message);
    }
  };

  const handleDeletePermit = (id: number) => {
    const targetPermit = permits.find((p) => p.id === id);
    const itemName = targetPermit
      ? `${targetPermit.company ? `${targetPermit.company} — ` : ''}${targetPermit.permit}`
      : undefined;

    setDeleteModalState({
      isOpen: true,
      type: 'single',
      permitId: id,
      permitName: itemName,
    });
  };

  const handleBatchDelete = () => {
    if (selectedPermitIds.length === 0) return;
    setDeleteModalState({
      isOpen: true,
      type: 'batch',
      count: selectedPermitIds.length,
    });
  };

  const handleConfirmDelete = async () => {
    try {
      if (deleteModalState.type === 'single' && deleteModalState.permitId !== undefined) {
        const id = deleteModalState.permitId;
        await deletePermit(id);
        setSelectedPermitIds((prev) => prev.filter((pid) => pid !== id));
        showToast('Permit removed successfully');
      } else if (deleteModalState.type === 'batch' && selectedPermitIds.length > 0) {
        const count = selectedPermitIds.length;
        await deletePermits(selectedPermitIds);
        showToast(`${count} permit${count !== 1 ? 's' : ''} removed successfully`);
        setSelectedPermitIds([]);
      }
      setDeleteModalState((prev) => ({ ...prev, isOpen: false }));
    } catch (err: any) {
      showToast('Error removing: ' + err.message);
    }
  };

  const handleCloseDeleteModal = () => {
    if (deletingId || isDeletingBatch) return;
    setDeleteModalState((prev) => ({ ...prev, isOpen: false }));
  };

  const handleSelectPermit = (id: number, checked: boolean) => {
    setSelectedPermitIds((prev) =>
      checked ? [...prev, id] : prev.filter((pid) => pid !== id)
    );
  };

  const handleSelectAll = (ids: number[], checked: boolean) => {
    if (checked) {
      // Add all ids that are not already selected
      setSelectedPermitIds((prev) => {
        const newIds = ids.filter((id) => !prev.includes(id));
        return [...prev, ...newIds];
      });
    } else {
      // Remove all provided ids from selection
      setSelectedPermitIds((prev) => prev.filter((id) => !ids.includes(id)));
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
    reader.onload = async (e) => {
      try {
        const text = String(e.target?.result || '');
        const count = await importCSVData(text);
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
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-200">
      {/* Header */}
      <Header
        isImporting={isImporting}
        onAddPermit={handleOpenAddModal}
        onExportCSV={handleExportCSV}
        onImportCSV={handleImportCSV}
        onOpenNextToExpire={() => setIsNextToExpireOpen(true)}
        upcomingCount={upcomingPermits.length}
      />

      {/* Main Content Dashboard */}
      <main className="flex-1 p-3 sm:p-4 md:p-6 flex flex-col gap-4 sm:gap-6 max-w-[1900px] w-full mx-auto">
        {/* Summary Cards */}
        <StatCards
          counts={statusCounts}
          activeFilter={statusFilter}
          onSelectFilter={setStatusFilter}
        />

        {/* Table Container */}
        <section className="bg-card text-card-foreground border border-border rounded-xl shadow-xs flex-1 flex flex-col overflow-hidden transition-colors">
          {/* Search & Filters */}
          <TableControls
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            sortField={sortField}
            sortDir={sortDir}
            onOpenSortModal={() => setIsSortModalOpen(true)}
            counts={statusCounts}
            totalFiltered={filteredPermits.length}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            selectedCount={selectedPermitIds.length}
            onBatchDelete={handleBatchDelete}
            isDeletingBatch={isDeletingBatch}
          />

          {/* Main Table / Cards View */}
          <PermitTable
            permits={paginatedPermits}
            isLoading={loading}
            deletingId={deletingId}
            onViewRemarks={handleViewRemarks}
            onDeletePermit={handleDeletePermit}
            onOpenAddModal={handleOpenAddModal}
            viewMode={viewMode}
            selectedIds={selectedPermitIds}
            onSelectPermit={handleSelectPermit}
            onSelectAll={handleSelectAll}
          />

          {/* Pagination Controls */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredPermits.length}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
          />
        </section>

        {/* Next to Expire Slide-Over Notification Drawer */}
        <NextToExpireSidebar
          isOpen={isNextToExpireOpen}
          onClose={() => setIsNextToExpireOpen(false)}
          permits={permits}
          onSelectFilter={setStatusFilter}
        />
      </main>

      {/* Sort Configuration Modal */}
      <SortModal
        isOpen={isSortModalOpen}
        sortField={sortField}
        sortDir={sortDir}
        onSortChange={setSort}
        onClose={() => setIsSortModalOpen(false)}
      />

      {/* Remarks / Details Modal */}
      <RemarksModal
        isOpen={remarksModalState.isOpen}
        permit={remarksModalState.permit}
        onClose={handleCloseRemarksModal}
        onEdit={handleOpenEditModal}
      />

      {/* Add / Edit Modal */}
      <PermitModal
        isOpen={modalState.isOpen}
        permit={modalState.permit}
        isSaving={isAdding || isUpdating}
        onClose={handleCloseModal}
        onSave={handleSavePermit}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={deleteModalState.isOpen}
        count={deleteModalState.count}
        itemName={deleteModalState.permitName}
        isDeleting={Boolean(deletingId) || isDeletingBatch}
        onConfirm={handleConfirmDelete}
        onClose={handleCloseDeleteModal}
      />

      {/* Toast Feedback */}
      <Toast message={toastMessage} />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<AuthPage />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
