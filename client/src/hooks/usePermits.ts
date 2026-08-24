import { useState, useEffect, useMemo, useCallback } from 'react';
import { Permit, FilterStatus, SortField, SortDirection, StatusCounts } from '../types/permit';
import { getMonthsDiff, getStatus, getRemarks } from '../utils/dateUtils';
import { normalizeDateStr, parseCSVText } from '../utils/csvUtils';
import { useAuth } from '../context/AuthContext';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export function usePermits() {
  const [permits, setPermits] = useState<Permit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('all');
  const [sortField, setSortField] = useState<SortField>('expiry');
  const [sortDir, setSortDir] = useState<SortDirection>('asc');

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
      if (!response.ok) throw new Error('Failed to fetch permits');
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
    const counts = { total: permits.length, green: 0, amber: 0, red: 0, gray: 0 };
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
    try {
      const response = await fetch(`${API_BASE}/permits`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('Failed to create permit');
      const resData = await response.json();
      const newPermit = { ...resData.permit, id: resData.permit.permit_id };
      setPermits((prev) => [newPermit, ...prev]);
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const updatePermit = async (id: number, data: Omit<Permit, 'id' | 'permit_id'>) => {
    if (!session?.access_token) return;
    try {
      const response = await fetch(`${API_BASE}/permits/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('Failed to update permit');
      const resData = await response.json();
      const updatedPermit = { ...resData.permit, id: resData.permit.permit_id };
      setPermits((prev) => prev.map((p) => (p.id === id ? updatedPermit : p)));
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const deletePermit = async (id: number) => {
    if (!session?.access_token) return;
    try {
      const response = await fetch(`${API_BASE}/permits/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      });
      if (!response.ok) throw new Error('Failed to delete permit');
      setPermits((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error(err);
      throw err;
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

    const table = parseCSVText(csvText);
    if (table.length < 2) return 0;

    const header = table[0].map((h) => h.trim().toLowerCase());
    const colIndex = (name: string) => header.indexOf(name);
    const col = {
      plant: colIndex('powerplant name'),
      environmental_law: colIndex('environmental law'),
      description: colIndex('description'),
      permit: colIndex('permit'),
      unit_coverage: colIndex('unit / coverage'),
      permit_no: colIndex('permit no.') !== -1 ? colIndex('permit no.') : colIndex('permit no'),
      date_issued: colIndex('date issued'),
      expiry: colIndex('expiry date'),
      remarks: colIndex('remarks'),
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
      let successCount = 0;
      for (const item of newItems) {
        try {
          await addPermit(item);
          successCount++;
        } catch (e) {
          console.error("Failed to import row", item, e);
        }
      }
      return successCount;
    }
    return 0;
  };

  const setSort = (field: SortField, dir: SortDirection) => {
    setSortField(field);
    setSortDir(dir);
  };

  return {
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
    setSort,
    toggleSort,
    addPermit,
    updatePermit,
    deletePermit,
    importCSVData,
    loading,
    error,
  };
}
