import { useState, useEffect, useMemo } from 'react';
import { Permit, FilterStatus, SortField, SortDirection, StatusCounts } from '../types/permit';
import { getMonthsDiff, getStatus, getRemarks } from '../utils/dateUtils';
import { normalizeDateStr, parseCSVText } from '../utils/csvUtils';

const STORAGE_KEY = 'permit_tracker_v1';

const INITIAL_DATA: Permit[] = [
  {
    id: 1,
    plant: 'Batangas Power Corp',
    environmental_law: 'Philippine Clean Water Act',
    description: 'WasteWater Discharge Permit (DP)',
    permit: 'Permit to Operate',
    unit_coverage: 'Oil Water Separator',
    permit_no: 'XX-123-45-67890',
    date_issued: '2021-10-10',
    expiry: '2026-10-12',
    remarks: 'Renewal pending approval',
    remarksAuto: false,
  },
  {
    id: 2,
    plant: 'Marinduque Powerplant',
    environmental_law: 'Philippine Clean Air Act of 2004',
    description: 'WasteWater Discharge Permit (DP)',
    permit: 'Permit to Operate',
    unit_coverage: 'Oil Water Separator',
    permit_no: 'XX-123-45-67891',
    date_issued: '2021-07-06',
    expiry: '2026-07-23',
    remarks: 'Expired',
    remarksAuto: false,
  },
  {
    id: 3,
    plant: 'Luzon Energy Hub',
    environmental_law: 'Philippine Clean Water Act',
    description: 'Hazardous Waste Generator ID',
    permit: 'Registration',
    unit_coverage: 'Facility Wide',
    permit_no: 'HWG-987-654',
    date_issued: '2022-01-15',
    expiry: '2026-08-07',
    remarks: 'Missing documentation',
    remarksAuto: false,
  },
  {
    id: 4,
    plant: 'Visayas Thermal Plant',
    environmental_law: 'Philippine Clean Air Act of 2004',
    description: 'WasteWater Discharge Permit (DP)',
    permit: 'Permit to Operate',
    unit_coverage: 'Oil Water Separator',
    permit_no: 'XX-123-45-67892',
    date_issued: '2023-02-18',
    expiry: '2026-08-27',
    remarks: 'Preparing for renewal',
    remarksAuto: false,
  },
  {
    id: 5,
    plant: 'Mindanao Geo Hub',
    environmental_law: 'Renewable Energy Compliance Act',
    description: 'Geothermal Operation Certificate',
    permit: 'Environmental Compliance Certificate (ECC)',
    unit_coverage: 'Unit 1 & 2 Generators',
    permit_no: 'ECC-2023-8891',
    date_issued: '2023-05-10',
    expiry: '2026-11-15',
    remarks: '',
    remarksAuto: true,
  },
];

export function usePermits() {
  const [permits, setPermits] = useState<Permit[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.rows && Array.isArray(parsed.rows)) {
          return parsed.rows;
        }
      }
    } catch (e) {
      console.error('Failed to load permits from localStorage:', e);
    }
    return INITIAL_DATA;
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('all');
  const [sortField, setSortField] = useState<SortField>('expiry');
  const [sortDir, setSortDir] = useState<SortDirection>('asc');

  // Sync to localStorage
  useEffect(() => {
    try {
      const maxId = permits.length > 0 ? Math.max(...permits.map((p) => p.id)) : 0;
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ rows: permits, nextId: maxId + 1 }));
    } catch (e) {
      console.error('Failed to save permits to localStorage:', e);
    }
  }, [permits]);

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

  const addPermit = (data: Omit<Permit, 'id'>) => {
    const nextId = permits.length > 0 ? Math.max(...permits.map((p) => p.id)) + 1 : 1;
    const newPermit: Permit = {
      ...data,
      id: nextId,
    };
    setPermits((prev) => [newPermit, ...prev]);
  };

  const updatePermit = (id: number, data: Omit<Permit, 'id'>) => {
    setPermits((prev) => prev.map((p) => (p.id === id ? { ...data, id } : p)));
  };

  const deletePermit = (id: number) => {
    setPermits((prev) => prev.filter((p) => p.id !== id));
  };

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDir('asc');
    }
  };

  const importCSVData = (csvText: string): number => {
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

    let nextId = permits.length > 0 ? Math.max(...permits.map((p) => p.id)) + 1 : 1;
    const newItems: Permit[] = [];

    for (let i = 1; i < table.length; i++) {
      const r = table[i];
      if (!r || r.every((c) => (c || '').trim() === '')) continue;

      const expiry = normalizeDateStr(get(r, 'expiry'));
      const date_issued = normalizeDateStr(get(r, 'date_issued'));
      const remarks = get(r, 'remarks').replace(/^\[(GREEN|ORANGE|RED|GRAY)\]\s*/i, '');
      const autoText = getRemarks(getMonthsDiff(expiry));
      const remarksAuto = remarks === '' || remarks === autoText;

      newItems.push({
        id: nextId++,
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
      setPermits((prev) => [...newItems, ...prev]);
    }
    return newItems.length;
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
    toggleSort,
    addPermit,
    updatePermit,
    deletePermit,
    importCSVData,
  };
}
