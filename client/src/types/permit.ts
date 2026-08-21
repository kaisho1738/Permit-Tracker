export type StatusType = 'green' | 'amber' | 'red' | 'gray';

export interface Permit {
  id: number;
  plant: string;
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

export type SortField = 'plant' | 'environmental_law' | 'permit' | 'date_issued' | 'expiry';
export type SortDirection = 'asc' | 'desc';
export type FilterStatus = 'all' | 'red' | 'amber' | 'green';

export interface StatusCounts {
  total: number;
  green: number;
  amber: number;
  red: number;
  gray: number;
}
