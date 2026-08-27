export type StatusType = 'green' | 'amber' | 'orange' | 'rose' | 'gray';

export interface Permit {
  id: number;
  permit_id?: number;
  company: string;
  environmental_law: string;
  description: string;
  permit: string;
  unit_coverage: string;
  permit_no: string;
  date_issued: string; // YYYY-MM-DD
  expiry: string;      // YYYY-MM-DD
  remarks: string;
  remarksAuto?: boolean;
}

export type SortField = 'company' | 'environmental_law' | 'permit' | 'date_issued' | 'expiry';
export type SortDirection = 'asc' | 'desc';
export type FilterStatus = 'all' | 'rose' | 'orange' | 'amber' | 'green';

export interface StatusCounts {
  total: number;
  green: number;
  amber: number;
  orange: number;
  rose: number;
  gray: number;
}
