import { Permit } from '../types/permit';
import { getMonthsDiff, getStatus, getRemarks, getStatusMeta } from './dateUtils';

/**
 * Exports permit records to a downloadable RFC-compliant CSV.
 */
export function exportPermitsToCSV(permits: Permit[]): boolean {
  if (permits.length === 0) return false;

  const headers = [
    'Powerplant Name',
    'Environmental Law',
    'Description',
    'Permit',
    'Unit / Coverage',
    'Permit no.',
    'Date Issued',
    'Expiry Date',
    'Status',
    'Remarks',
  ];

  const csvRows = permits.map((r) => {
    const months = getMonthsDiff(r.expiry);
    const autoRemarks = getRemarks(months);
    const remarks = r.remarksAuto === false && r.remarks ? r.remarks : autoRemarks;
    const status = getStatus(months);
    const statusMeta = getStatusMeta(status);
    const remarksWithCode = `${statusMeta.code} ${remarks}`;

    return [
      r.plant,
      r.environmental_law,
      r.description,
      r.permit,
      r.unit_coverage,
      r.permit_no,
      r.date_issued,
      r.expiry,
      statusMeta.label,
      remarksWithCode,
    ]
      .map((v) => `"${(v || '').toString().replace(/"/g, '""')}"`)
      .join(',');
  });

  const csv = [headers.join(','), ...csvRows].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `permits_${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
  return true;
}

/**
 * Parses raw CSV text handling multiline and quotes.
 */
export function parseCSVText(text: string): string[][] {
  const table: string[][] = [];
  let row: string[] = [];
  let field = '';
  let inQuotes = false;
  const normalized = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

  for (let i = 0; i < normalized.length; i++) {
    const c = normalized[i];
    if (inQuotes) {
      if (c === '"') {
        if (normalized[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += c;
      }
    } else if (c === '"') {
      inQuotes = true;
    } else if (c === ',') {
      row.push(field);
      field = '';
    } else if (c === '\n') {
      row.push(field);
      table.push(row);
      row = [];
      field = '';
    } else {
      field += c;
    }
  }
  if (field.length > 0 || row.length > 0) {
    row.push(field);
    table.push(row);
  }
  return table;
}

/**
 * Formats any date string into standard YYYY-MM-DD.
 */
export function normalizeDateStr(str: string): string {
  const s = (str || '').trim();
  if (!s) return '';
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
  const d = new Date(s);
  if (isNaN(d.getTime())) return '';
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}
