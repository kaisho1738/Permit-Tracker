import { useState, useEffect, useMemo, useCallback } from 'react';
import { Permit, FilterStatus, SortField, SortDirection, StatusCounts } from '../types/permit';
import { getMonthsDiff, getStatus, getRemarks } from '../utils/dateUtils';
import { normalizeDateStr, parseCSVText } from '../utils/csvUtils';
import { useAuth } from '../context/AuthContext';

const API_BASE = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:5000/api' : '/api');

export function usePermits() {
  const [permits, setPermits] = useState<Permit[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [isDeletingBatch, setIsDeletingBatch] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('all');
  const [sortField, setSortField] = useState<SortField>('expiry');
  const [sortDir, setSortDir] = useState<SortDirection>('asc');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const PAGE_SIZE = 10;

  const { session } = useAuth();

  const fetchPermits = useCallback(async () => {
    if (!session?.access_token) return;
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/permits`, {
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      });
      if (!response.ok) {
        const errText = await response.text();
        throw new Error(errText || 'Failed to fetch permits');
      }
      const data = await response.json();
      const mappedPermits = data.permits.map((p: any) => ({
        ...p,
        id: p.permit_id
      }));
      setPermits(mappedPermits);
      setError(null);
    } catch (err: any) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [session?.access_token]);

  useEffect(() => {
    fetchPermits();
  }, [fetchPermits]);

  // Compute status counts across all permits
  const statusCounts = useMemo<StatusCounts>(() => {
    const counts: StatusCounts = { total: permits.length, green: 0, amber: 0, orange: 0, rose: 0, gray: 0 };
    permits.forEach((p) => {
      const s = getStatus(getMonthsDiff(p.expiry));
      counts[s]++;
    });
    return counts;
  }, [permits]);

  // Filtered and sorted permits
  const filteredPermits = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return permits
      .filter((r) => {
        if (!q) return true;
        return (
          r.plant.toLowerCase().includes(q) ||
          r.environmental_law.toLowerCase().includes(q) ||
          r.description.toLowerCase().includes(q) ||
          r.permit.toLowerCase().includes(q) ||
          r.unit_coverage.toLowerCase().includes(q) ||
          r.permit_no.toLowerCase().includes(q) ||
          r.remarks.toLowerCase().includes(q)
        );
      })
      .filter((r) => {
        if (statusFilter === 'all') return true;
        return getStatus(getMonthsDiff(r.expiry)) === statusFilter;
      })
      .sort((a, b) => {
        let av = a[sortField] || '';
        let bv = b[sortField] || '';

        if (sortField === 'expiry' || sortField === 'date_issued') {
          const at = av ? new Date(av).getTime() : Infinity;
          const bt = bv ? new Date(bv).getTime() : Infinity;
          return sortDir === 'asc' ? at - bt : bt - at;
        }

        return sortDir === 'asc'
          ? (av as string).localeCompare(bv as string)
          : (bv as string).localeCompare(av as string);
      });
  }, [permits, searchQuery, statusFilter, sortField, sortDir]);

  // Reset page when filter/search/sort changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, sortField, sortDir]);

  // Total pages based on filtered permits
  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(filteredPermits.length / PAGE_SIZE));
  }, [filteredPermits.length]);

  // Clamp current page when permits change
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  // Sliced permits for current page (PAGE_SIZE items per page)
  const paginatedPermits = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredPermits.slice(start, start + PAGE_SIZE);
  }, [filteredPermits, currentPage]);

  // 5 Upcoming Expirations
  const upcomingPermits = useMemo(() => {
    return permits
      .filter((p) => Boolean(p.expiry))
      .map((p) => ({
        permit: p,
        months: getMonthsDiff(p.expiry),
      }))
      .sort((a, b) => new Date(a.permit.expiry).getTime() - new Date(b.permit.expiry).getTime())
      .slice(0, 5);
  }, [permits]);

  const addPermit = async (data: Omit<Permit, 'id' | 'permit_id'>) => {
    if (!session?.access_token) return;
    setIsAdding(true);
    try {
      const response = await fetch(`${API_BASE}/permits`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify(data)
      });
      if (!response.ok) {
        const errText = await response.text();
        throw new Error(errText || 'Failed to create permit');
      }
      const resData = await response.json();
      const newPermit = { ...resData.permit, id: resData.permit.permit_id };
      setPermits((prev) => [newPermit, ...prev]);
    } catch (err) {
      console.error(err);
      throw err;
    } finally {
      setIsAdding(false);
    }
  };

  const updatePermit = async (id: number, data: Omit<Permit, 'id' | 'permit_id'>) => {
    if (!session?.access_token) return;
    setIsUpdating(true);
    try {
      const response = await fetch(`${API_BASE}/permits/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify(data)
      });
      if (!response.ok) {
        const errText = await response.text();
        throw new Error(errText || 'Failed to update permit');
      }
      const resData = await response.json();
      const updatedPermit = { ...resData.permit, id: resData.permit.permit_id };
      setPermits((prev) => prev.map((p) => (p.id === id ? updatedPermit : p)));
    } catch (err) {
      console.error(err);
      throw err;
    } finally {
      setIsUpdating(false);
    }
  };

  const deletePermit = async (id: number) => {
    if (!session?.access_token) return;
    setDeletingId(id);
    try {
      const response = await fetch(`${API_BASE}/permits/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      });
      if (!response.ok) {
        const errText = await response.text();
        throw new Error(errText || 'Failed to delete permit');
      }
      setPermits((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error(err);
      throw err;
    } finally {
      setDeletingId(null);
    }
  };

  const deletePermits = async (ids: number[]) => {
    if (!session?.access_token || ids.length === 0) return;
    setIsDeletingBatch(true);
    try {
      const response = await fetch(`${API_BASE}/permits/batch-delete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({ ids })
      });
      if (!response.ok) {
        const errText = await response.text();
        throw new Error(errText || 'Failed to delete permits');
      }
      setPermits((prev) => prev.filter((p) => !ids.includes(p.id)));
    } catch (err) {
      console.error(err);
      throw err;
    } finally {
      setIsDeletingBatch(false);
    }
  };

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDir('asc');
    }
  };

  const importCSVData = async (csvText: string): Promise<number> => {
    if (!session?.access_token) return 0;
    setIsImporting(true);
    try {
      const table = parseCSVText(csvText);
      if (table.length < 2) return 0;

      const header = table[0].map((h) => h.trim().toLowerCase());
      const findCol = (...names: string[]) => {
        for (const name of names) {
          const idx = header.indexOf(name.toLowerCase());
          if (idx !== -1) return idx;
        }
        return -1;
      };

      const col = {
        plant: findCol('company name', 'company', 'powerplant name', 'powerplant', 'plant name', 'plant'),
        environmental_law: findCol('environmental law', 'law', 'environmental_law'),
        description: findCol('description', 'desc'),
        permit: findCol('permit', 'permit type', 'permit_type'),
        unit_coverage: findCol('unit / coverage', 'unit coverage', 'coverage', 'unit_coverage', 'unit'),
        permit_no: findCol('permit no.', 'permit no', 'permit_no', 'permit_number', 'permit number'),
        date_issued: findCol('date issued', 'date_issued', 'issued date', 'issued_date', 'issued'),
        expiry: findCol('expiry date', 'expiry_date', 'expiration date', 'expiration_date', 'expiry', 'expires'),
        remarks: findCol('remarks', 'remark', 'notes', 'status remarks'),
      };

      if (col.plant === -1 && col.permit === -1) {
        throw new Error("CSV headers don't match expected permit format");
      }

      const get = (r: string[], key: keyof typeof col) =>
        col[key] > -1 && r[col[key]] !== undefined ? r[col[key]].trim() : '';

      const newItems: Omit<Permit, 'id' | 'permit_id'>[] = [];

      for (let i = 1; i < table.length; i++) {
        const r = table[i];
        if (!r || r.every((c) => (c || '').trim() === '')) continue;

        const expiry = normalizeDateStr(get(r, 'expiry'));
        const date_issued = normalizeDateStr(get(r, 'date_issued'));
        const remarks = get(r, 'remarks').replace(/^\[(GREEN|ORANGE|RED|GRAY)\]\s*/i, '');
        const autoText = getRemarks(getMonthsDiff(expiry));
        const remarksAuto = remarks === '' || remarks === autoText;

        newItems.push({
          plant: get(r, 'plant'),
          environmental_law: get(r, 'environmental_law'),
          description: get(r, 'description'),
          permit: get(r, 'permit'),
          unit_coverage: get(r, 'unit_coverage'),
          permit_no: get(r, 'permit_no'),
          date_issued,
          expiry,
          remarks: remarksAuto ? autoText : remarks,
          remarksAuto,
        });
      }

      if (newItems.length > 0) {
        const response = await fetch(`${API_BASE}/permits/batch-import`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({ permits: newItems }),
        });

        if (!response.ok) {
          const errText = await response.text();
          throw new Error(errText || 'Failed to import permits via batch');
        }

        const resData = await response.json();
        const importedPermits: Permit[] = (resData.permits || []).map((p: any) => ({
          ...p,
          id: p.permit_id ?? p.id,
        }));

        setPermits((prev) => [...importedPermits, ...prev]);
        return importedPermits.length;
      }
      return 0;
    } catch (err) {
      console.error(err);
      throw err;
    } finally {
      setIsImporting(false);
    }
  };

  const setSort = (field: SortField, dir: SortDirection) => {
    setSortField(field);
    setSortDir(dir);
  };

  return {
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
    toggleSort,
    currentPage,
    setCurrentPage,
    totalPages,
    pageSize: PAGE_SIZE,
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
    error,
  };
}
