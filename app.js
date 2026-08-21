/**
 * Powerplant Permit Tracker - Core Application Logic
 * Supports Light/Dark Mode, LocalStorage persistence, CSV Import/Export,
 * Add/Edit Modals, 3-dots Action Menus, and dynamic status calculation.
 */

const STORAGE_KEY = 'permit_tracker_v1';
const THEME_KEY = 'permit_tracker_theme';

// Default initial sample data if localStorage is empty
const INITIAL_DATA = [
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
    remarksAuto: false
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
    remarksAuto: false
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
    remarksAuto: false
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
    remarksAuto: false
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
    remarksAuto: true
  }
];

let rows = [];
let nextId = 1;
let sortField = 'expiry';
let sortDir = 'asc';
let statusFilter = 'all'; // 'all' | 'red' | 'amber' | 'green'
let activeActionMenuRowId = null;

// ==========================================
// Theme Management (Light / Dark Mode)
// ==========================================
function initTheme() {
  const savedTheme = localStorage.getItem(THEME_KEY);
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const isDark = savedTheme === 'dark' || (!savedTheme && prefersDark);

  setTheme(isDark ? 'dark' : 'light');
}

function setTheme(theme) {
  const html = document.documentElement;
  const toggle = document.getElementById('theme-toggle');
  const toggleStatusText = document.getElementById('theme-status-text');

  if (theme === 'dark') {
    html.classList.add('dark');
    localStorage.setItem(THEME_KEY, 'dark');
    if (toggle) toggle.checked = true;
    if (toggleStatusText) toggleStatusText.textContent = 'Dark';
  } else {
    html.classList.remove('dark');
    localStorage.setItem(THEME_KEY, 'light');
    if (toggle) toggle.checked = false;
    if (toggleStatusText) toggleStatusText.textContent = 'Light';
  }
}

function toggleTheme() {
  const isCurrentlyDark = document.documentElement.classList.contains('dark');
  setTheme(isCurrentlyDark ? 'light' : 'dark');
}

// ==========================================
// Profile Popup / Modal
// ==========================================
function toggleProfileModal(event) {
  if (event) event.stopPropagation();
  const modal = document.getElementById('profile-dropdown');
  if (!modal) return;

  const isHidden = modal.classList.contains('hidden');
  closeAllDropdowns();

  if (isHidden) {
    modal.classList.remove('hidden');
  } else {
    modal.classList.add('hidden');
  }
}

function closeAllDropdowns() {
  const profileDropdown = document.getElementById('profile-dropdown');
  if (profileDropdown) profileDropdown.classList.add('hidden');

  const actionMenu = document.getElementById('row-action-menu');
  if (actionMenu) {
    actionMenu.classList.add('hidden');
    activeActionMenuRowId = null;
  }
}

// Global click listener to close popups when clicking outside
document.addEventListener('click', (e) => {
  const profileDropdown = document.getElementById('profile-dropdown');
  const profileBtn = document.getElementById('profile-btn');
  const actionMenu = document.getElementById('row-action-menu');

  if (profileDropdown && !profileDropdown.contains(e.target) && (!profileBtn || !profileBtn.contains(e.target))) {
    profileDropdown.classList.add('hidden');
  }

  if (actionMenu && !actionMenu.contains(e.target) && !e.target.closest('.row-action-btn')) {
    actionMenu.classList.add('hidden');
    activeActionMenuRowId = null;
  }
});

// ==========================================
// Local Storage & Data Handling
// ==========================================
function loadData() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      rows = parsed.rows || [];
      nextId = parsed.nextId || (rows.length > 0 ? Math.max(...rows.map(r => r.id)) + 1 : 1);

      rows.forEach(r => {
        if (r.remarksAuto === undefined) {
          const remarksStr = r.remarks ?? '';
          r.remarksAuto = String(remarksStr).trim() === '';
        }
      });
    } else {
      // Populate with initial sample data
      rows = JSON.parse(JSON.stringify(INITIAL_DATA));
      nextId = 6;
      saveData();
    }
  } catch (e) {
    console.error('Error loading data from localStorage:', e);
    rows = JSON.parse(JSON.stringify(INITIAL_DATA));
  }
}

function saveData() {
  try {
    const data = { rows, nextId };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Error saving data to localStorage:', e);
  }
}

// ==========================================
// Date & Status Business Logic
// ==========================================
function getMonthsDiff(expiryDateStr) {
  if (!expiryDateStr) return null;
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const exp = new Date(expiryDateStr);
  if (isNaN(exp.getTime())) return null;

  return (exp - now) / (1000 * 60 * 60 * 24 * 30.4375);
}

function getStatus(months) {
  if (months == null) return 'gray';
  if (months < 0) return 'red';
  if (months < 3) return 'red';
  if (months < 6) return 'amber';
  return 'green';
}

function getRemarks(months) {
  if (months == null) return 'Set a date';

  const totalDays = Math.round(Math.abs(months) * 30.4375);

  if (months < 0) {
    return `Expired ${totalDays} day${totalDays !== 1 ? 's' : ''} ago`;
  }

  const m = Math.floor(months);
  const d = totalDays - (m * 30);

  if (m === 0) return `Expiring in ${totalDays} day${totalDays !== 1 ? 's' : ''}`;
  if (d <= 0) return `Expiring in ${m} month${m !== 1 ? 's' : ''}`;
  return `Expiring in ${m} mo. ${d} day${d !== 1 ? 's' : ''}`;
}

function getStatusMeta(status) {
  return {
    green: {
      label: 'Safe',
      code: '[GREEN]',
      badgeClass: 'bg-success-50 text-success-500 border-success-200 dark:bg-success/20 dark:text-success dark:border-success/30',
      dotClass: 'bg-success-500 dark:bg-success'
    },
    amber: {
      label: 'Expiring Soon',
      code: '[ORANGE]',
      badgeClass: 'bg-warning-50 text-warning-600 border-warning-200 dark:bg-warning/20 dark:text-warning dark:border-warning/30',
      dotClass: 'bg-warning-500 dark:bg-warning'
    },
    red: {
      label: 'Critical / Expired',
      code: '[RED]',
      badgeClass: 'bg-danger-50 text-danger-500 border-danger-200 dark:bg-error/20 dark:text-error dark:border-error/30',
      dotClass: 'bg-danger-500 dark:bg-error'
    },
    gray: {
      label: 'No Date',
      code: '[GRAY]',
      badgeClass: 'bg-gray-100 text-gray-500 border-gray-200 dark:bg-surface-container-highest dark:text-on-surface-variant dark:border-outline-variant',
      dotClass: 'bg-gray-400 dark:bg-on-surface-variant'
    }
  }[status] || {
    label: 'No Date',
    code: '[GRAY]',
    badgeClass: 'bg-gray-100 text-gray-500 border-gray-200 dark:bg-surface-container-highest dark:text-on-surface-variant dark:border-outline-variant',
    dotClass: 'bg-gray-400 dark:bg-on-surface-variant'
  };
}

function formatDateDisplay(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  const day = String(d.getDate()).padStart(2, '0');
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const month = months[d.getMonth()];
  const year = d.getFullYear();
  return `${day} ${month} ${year}`;
}

// ==========================================
// Sorting & Filtering
// ==========================================
function setFilter(status) {
  statusFilter = status;
  renderTable();
}

const SORT_META = {
  plant: { name: 'Powerplant', asc: 'A to Z (Alphabetical)', desc: 'Z to A (Reverse)', shortAsc: 'A–Z', shortDesc: 'Z–A' },
  permit: { name: 'Permit Name', asc: 'A to Z (Alphabetical)', desc: 'Z to A (Reverse)', shortAsc: 'A–Z', shortDesc: 'Z–A' },
  expiry: { name: 'Expiry Date', asc: 'Earliest to Latest', desc: 'Latest to Earliest', shortAsc: 'Earliest', shortDesc: 'Latest' },
  date_issued: { name: 'Date Issued', asc: 'Oldest to Newest', desc: 'Newest to Oldest', shortAsc: 'Oldest', shortDesc: 'Newest' }
};

function openSortModal() {
  closeAllDropdowns();
  const modal = document.getElementById('sort-modal');
  if (!modal) return;
  updateSortModalUI();
  modal.classList.remove('hidden');
  document.body.classList.add('overflow-hidden');
}

function closeSortModal() {
  const modal = document.getElementById('sort-modal');
  if (modal) modal.classList.add('hidden');
  document.body.classList.remove('overflow-hidden');
}

function selectSortColumn(field) {
  sortField = field;
  updateSortModalUI();
  renderTable();
}

function selectSortDir(dir) {
  sortDir = dir;
  updateSortModalUI();
  renderTable();
}

function resetSort() {
  sortField = 'expiry';
  sortDir = 'asc';
  updateSortModalUI();
  renderTable();
}

function updateSortModalUI() {
  const meta = SORT_META[sortField] || SORT_META.expiry;

  // Update button classes for columns
  const fields = ['plant', 'permit', 'expiry', 'date_issued'];
  fields.forEach(f => {
    const btn = document.getElementById(`sort-btn-${f}`);
    if (btn) {
      const isSelected = sortField === f;
      const check = btn.querySelector('.sort-check');
      if (isSelected) {
        btn.className = 'p-3 rounded-lg border text-left flex items-center justify-between transition-all cursor-pointer border-brand-600 bg-brand-50/50 text-brand-700 dark:border-primary dark:bg-primary-container/20 dark:text-primary font-semibold ring-1 ring-brand-500 dark:ring-primary';
        if (check) check.classList.remove('hidden');
      } else {
        btn.className = 'p-3 rounded-lg border text-left flex items-center justify-between transition-all cursor-pointer border-gray-200 dark:border-outline-variant bg-white dark:bg-surface-container-low text-gray-700 dark:text-on-surface hover:bg-gray-50 dark:hover:bg-surface-container-high';
        if (check) check.classList.add('hidden');
      }
    }
  });

  // Update button classes for directions
  const ascBtn = document.getElementById('sort-dir-asc');
  const descBtn = document.getElementById('sort-dir-desc');
  const ascCheck = ascBtn?.querySelector('.sort-check');
  const descCheck = descBtn?.querySelector('.sort-check');

  if (ascBtn) {
    if (sortDir === 'asc') {
      ascBtn.className = 'p-3 rounded-lg border text-left flex flex-col gap-1 transition-all cursor-pointer border-brand-600 bg-brand-50/50 text-brand-700 dark:border-primary dark:bg-primary-container/20 dark:text-primary font-semibold ring-1 ring-brand-500 dark:ring-primary';
      if (ascCheck) ascCheck.classList.remove('hidden');
    } else {
      ascBtn.className = 'p-3 rounded-lg border text-left flex flex-col gap-1 transition-all cursor-pointer border-gray-200 dark:border-outline-variant bg-white dark:bg-surface-container-low text-gray-700 dark:text-on-surface hover:bg-gray-50 dark:hover:bg-surface-container-high';
      if (ascCheck) ascCheck.classList.add('hidden');
    }
  }

  if (descBtn) {
    if (sortDir === 'desc') {
      descBtn.className = 'p-3 rounded-lg border text-left flex flex-col gap-1 transition-all cursor-pointer border-brand-600 bg-brand-50/50 text-brand-700 dark:border-primary dark:bg-primary-container/20 dark:text-primary font-semibold ring-1 ring-brand-500 dark:ring-primary';
      if (descCheck) descCheck.classList.remove('hidden');
    } else {
      descBtn.className = 'p-3 rounded-lg border text-left flex flex-col gap-1 transition-all cursor-pointer border-gray-200 dark:border-outline-variant bg-white dark:bg-surface-container-low text-gray-700 dark:text-on-surface hover:bg-gray-50 dark:hover:bg-surface-container-high';
      if (descCheck) descCheck.classList.add('hidden');
    }
  }

  // Direction labels
  const ascLabel = document.getElementById('sort-desc-asc-label');
  const descLabel = document.getElementById('sort-desc-desc-label');
  if (ascLabel) ascLabel.textContent = meta.asc;
  if (descLabel) descLabel.textContent = meta.desc;

  // Summary text in modal
  const summary = document.getElementById('sort-summary-text');
  if (summary) {
    summary.innerHTML = `${meta.name} • <strong class="text-brand-600 dark:text-primary font-medium">${sortDir === 'asc' ? 'Ascending' : 'Descending'}</strong> (${sortDir === 'asc' ? meta.asc : meta.desc})`;
  }

  // Main UI Sort Button Label
  const labelName = document.getElementById('sort-label-name');
  const labelDir = document.getElementById('sort-label-dir');
  if (labelName) labelName.textContent = meta.name;
  if (labelDir) labelDir.textContent = sortDir === 'asc' ? meta.shortAsc : meta.shortDesc;
}

function getSortedRows(data) {
  return [...data].sort((a, b) => {
    let av = a[sortField] || '';
    let bv = b[sortField] || '';

    if (sortField === 'expiry' || sortField === 'date_issued') {
      av = av ? new Date(av).getTime() : Infinity;
      bv = bv ? new Date(bv).getTime() : Infinity;
      return sortDir === 'asc' ? av - bv : bv - av;
    }

    return sortDir === 'asc'
      ? av.localeCompare(bv)
      : bv.localeCompare(av);
  });
}

// ==========================================
// Render Table & UI
// ==========================================
function renderTable() {
  const searchInput = document.getElementById('search-input');
  const query = (searchInput ? searchInput.value : '').toLowerCase().trim();

  let filtered = rows.filter(r => {
    if (!query) return true;
    return (
      (r.plant || '').toLowerCase().includes(query) ||
      (r.environmental_law || '').toLowerCase().includes(query) ||
      (r.description || '').toLowerCase().includes(query) ||
      (r.permit || '').toLowerCase().includes(query) ||
      (r.unit_coverage || '').toLowerCase().includes(query) ||
      (r.permit_no || '').toLowerCase().includes(query) ||
      (r.remarks || '').toLowerCase().includes(query)
    );
  });

  if (statusFilter !== 'all') {
    filtered = filtered.filter(r => getStatus(getMonthsDiff(r.expiry)) === statusFilter);
  }

  const sorted = getSortedRows(filtered);
  const tbody = document.getElementById('tbody');
  const emptyState = document.getElementById('empty-state');
  const emptyStateText = document.getElementById('empty-state-text');

  if (rows.length === 0) {
    if (emptyStateText) emptyStateText.innerHTML = 'No permits yet — click <strong class="text-brand-600 dark:text-primary cursor-pointer" onclick="openPermitModal()">Add Permit</strong> to get started.';
    if (emptyState) emptyState.classList.remove('hidden');
    if (tbody) tbody.innerHTML = '';
  } else if (sorted.length === 0) {
    if (emptyStateText) emptyStateText.textContent = 'No permits match your search or active filter.';
    if (emptyState) emptyState.classList.remove('hidden');
    if (tbody) tbody.innerHTML = '';
  } else {
    if (emptyState) emptyState.classList.add('hidden');
    if (tbody) {
      tbody.innerHTML = sorted.map(row => {
        const months = getMonthsDiff(row.expiry);
        const status = getStatus(months);
        const meta = getStatusMeta(status);
        const autoRemarks = getRemarks(months);
        const remarksText = (row.remarksAuto === false && row.remarks) ? row.remarks : autoRemarks;

        return `
          <tr class="hover:bg-blue-50/40 dark:hover:bg-surface-container-high transition-colors group cursor-pointer"
              onclick="openRemarksModal(${row.id})"
              title="Click to view remarks and permit details">
            <td class="px-3.5 py-3.5 whitespace-nowrap text-gray-900 dark:text-on-surface font-semibold text-sm">
              ${esc(row.plant || '—')}
            </td>
            <td class="px-3.5 py-3.5 text-gray-900 dark:text-on-surface font-medium text-sm">
              ${esc(row.environmental_law || '—')}
            </td>
            <td class="px-3.5 py-3.5 text-gray-500 dark:text-on-surface-variant text-sm">
              ${esc(row.description || '—')}
            </td>
            <td class="px-3.5 py-3.5 text-gray-900 dark:text-on-surface text-sm">
              ${esc(row.permit || '—')}
            </td>
            <td class="px-3.5 py-3.5 text-gray-500 dark:text-on-surface-variant text-sm">
              ${esc(row.unit_coverage || '—')}
            </td>
            <td class="px-3 py-3.5 text-gray-900 dark:text-on-surface text-sm font-mono whitespace-nowrap">
              ${esc(row.permit_no || '—')}
            </td>
            <td class="px-3 py-3.5 whitespace-nowrap text-gray-900 dark:text-on-surface text-sm">
              ${formatDateDisplay(row.date_issued)}
            </td>
            <td class="px-3 py-3.5 whitespace-nowrap text-gray-900 dark:text-on-surface text-sm font-medium">
              ${formatDateDisplay(row.expiry)}
            </td>
            <td class="px-3 py-3.5 whitespace-nowrap">
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${meta.badgeClass}">
                <div class="w-1.5 h-1.5 rounded-full ${meta.dotClass} mr-1.5"></div>
                ${meta.label}
              </span>
            </td>
            <td class="px-3 py-3.5 whitespace-nowrap text-right text-gray-400 dark:text-on-surface-variant relative">
              <button class="w-8 h-8 rounded-md flex items-center justify-center text-gray-400 hover:text-danger-500 hover:bg-danger-50 dark:hover:bg-error/10 dark:hover:text-error transition-colors focus:outline-none ml-auto cursor-pointer" 
                      onclick="handleDirectDelete(event, ${row.id})" 
                      title="Delete Permit">
                <i class="fa-solid fa-trash text-xs pointer-events-none"></i>
              </button>
            </td>
          </tr>
        `;
      }).join('');
    }
  }

  // Calculate status counts
  let counts = { green: 0, amber: 0, red: 0 };
  rows.forEach(r => {
    const s = getStatus(getMonthsDiff(r.expiry));
    if (s !== 'gray') counts[s]++;
  });

  // Update stat cards
  const sTotal = document.getElementById('s-total');
  const sGreen = document.getElementById('s-green');
  const sAmber = document.getElementById('s-amber');
  const sRed = document.getElementById('s-red');
  if (sTotal) sTotal.textContent = rows.length;
  if (sGreen) sGreen.textContent = counts.green;
  if (sAmber) sAmber.textContent = counts.amber;
  if (sRed) sRed.textContent = counts.red;

  // Update filter pills counts
  const fAll = document.getElementById('f-all');
  const fRed = document.getElementById('f-red');
  const fAmber = document.getElementById('f-amber');
  const fGreen = document.getElementById('f-green');
  if (fAll) fAll.textContent = rows.length;
  if (fRed) fRed.textContent = counts.red;
  if (fAmber) fAmber.textContent = counts.amber;
  if (fGreen) fGreen.textContent = counts.green;

  // Update footer / table info
  const rowCount = document.getElementById('row-count');
  if (rowCount) {
    const isFiltered = query || statusFilter !== 'all';
    rowCount.textContent = isFiltered
      ? `${sorted.length} of ${rows.length} permit${rows.length !== 1 ? 's' : ''}`
      : `${rows.length} permit${rows.length !== 1 ? 's' : ''}`;
  }

  updateFilterPillStyles();
  updateDashboard(counts);
  updateSortModalUI();
}

function updateFilterPillStyles() {
  const pills = document.querySelectorAll('.filter-pill');
  pills.forEach(pill => {
    const status = pill.dataset.status;
    const isActive = status === statusFilter;

    if (isActive) {
      pill.className = 'filter-pill px-4 py-2 text-sm font-medium text-white bg-gray-900 dark:bg-on-surface dark:text-surface rounded-full flex items-center gap-2 shadow-sm transition-all';
    } else {
      pill.className = 'filter-pill px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-200 rounded-full hover:bg-gray-200 dark:text-on-surface dark:bg-surface-container dark:border-outline-variant dark:hover:bg-surface-container-high flex items-center gap-2 transition-all';
    }
  });

  const cards = document.querySelectorAll('.stat-card');
  cards.forEach(card => {
    const status = card.dataset.status;
    if (status === statusFilter) {
      card.classList.add('ring-2', 'ring-brand-500', 'dark:ring-primary');
    } else {
      card.classList.remove('ring-2', 'ring-brand-500', 'dark:ring-primary');
    }
  });
}

function updateDashboard(counts) {
  const total = rows.length;
  const grayCount = Math.max(0, total - counts.green - counts.amber - counts.red);

  const distLabel = document.getElementById('dist-total-label');
  if (distLabel) {
    distLabel.textContent = `${total} permit${total !== 1 ? 's' : ''}`;
  }

  const redBar = document.getElementById('dist-red');
  const amberBar = document.getElementById('dist-amber');
  const greenBar = document.getElementById('dist-green');
  const grayBar = document.getElementById('dist-gray');

  if (redBar) redBar.style.width = total > 0 ? `${(counts.red / total) * 100}%` : '0%';
  if (amberBar) amberBar.style.width = total > 0 ? `${(counts.amber / total) * 100}%` : '0%';
  if (greenBar) greenBar.style.width = total > 0 ? `${(counts.green / total) * 100}%` : '0%';
  if (grayBar) grayBar.style.width = total > 0 ? `${(grayCount / total) * 100}%` : '0%';

  // Next to Expire Panel
  const upcoming = rows
    .filter(r => r.expiry)
    .map(r => ({ row: r, months: getMonthsDiff(r.expiry) }))
    .sort((a, b) => new Date(a.row.expiry) - new Date(b.row.expiry))
    .slice(0, 5);

  const list = document.getElementById('upcoming-list');
  if (list) {
    if (upcoming.length === 0) {
      list.innerHTML = '<li class="text-xs text-gray-400 dark:text-on-surface-variant py-2">No permits with expiry dates.</li>';
    } else {
      list.innerHTML = upcoming.map(({ row: r, months }) => {
        const status = getStatus(months);
        const meta = getStatusMeta(status);
        const name = r.plant && r.plant.trim() ? r.plant : 'Untitled permit';
        const dateStr = formatDateDisplay(r.expiry);

        return `
          <li class="flex justify-between items-start border-b border-gray-100 dark:border-outline-variant pb-3 last:border-0 hover:bg-black/5 dark:hover:bg-white/5 p-1.5 rounded cursor-pointer transition-colors" 
              onclick="setFilter('${status}')" 
              title="Filter by ${meta.label}">
            <div class="overflow-hidden pr-2">
              <div class="text-sm font-semibold text-gray-900 dark:text-on-surface truncate">${esc(name)}</div>
              <div class="text-xs text-gray-500 dark:text-on-surface-variant mt-0.5">${esc(r.permit || '')} • ${dateStr}</div>
            </div>
            <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border shrink-0 ${meta.badgeClass}">
              ${meta.label.replace(' / Expired', '')}
            </span>
          </li>
        `;
      }).join('');
    }
  }
}

// ==========================================
// 3-Dots Action Menu (Edit / Delete)
// ==========================================
function handleDirectDelete(event, rowId) {
  if (event) event.stopPropagation();
  closeAllDropdowns();
  if (confirm('Are you sure you want to remove this permit?')) {
    deleteRow(rowId);
  }
}

function openActionMenu(event, rowId) {
  event.stopPropagation();
  activeActionMenuRowId = rowId;

  const menu = document.getElementById('row-action-menu');
  if (!menu) return;

  const btn = event.currentTarget;
  const rect = btn.getBoundingClientRect();

  menu.style.top = `${rect.bottom + window.scrollY + 4}px`;
  menu.style.left = `${rect.right + window.scrollX - 140}px`;
  menu.classList.remove('hidden');
}

function handleMenuViewRemarks() {
  if (activeActionMenuRowId == null) return;
  const rowId = activeActionMenuRowId;
  closeAllDropdowns();
  openRemarksModal(rowId);
}

function handleMenuEdit() {
  if (activeActionMenuRowId == null) return;
  const rowId = activeActionMenuRowId;
  closeAllDropdowns();
  openPermitModal(rowId);
}

function handleMenuDelete() {
  if (activeActionMenuRowId == null) return;
  const rowId = activeActionMenuRowId;
  closeAllDropdowns();

  if (confirm('Are you sure you want to remove this permit?')) {
    deleteRow(rowId);
  }
}

// ==========================================
// Remarks & Details Modal
// ==========================================
function openRemarksModal(rowId) {
  closeAllDropdowns();
  const row = rows.find(r => r.id === rowId);
  if (!row) return;

  const modal = document.getElementById('remarks-modal');
  if (!modal) return;

  const months = getMonthsDiff(row.expiry);
  const status = getStatus(months);
  const meta = getStatusMeta(status);
  const autoRemarks = getRemarks(months);
  const remarksText = (row.remarksAuto === false && row.remarks) ? row.remarks : autoRemarks;
  const isCustomRemarks = row.remarksAuto === false && Boolean(row.remarks);

  // Status Badge
  const statusBadge = document.getElementById('rm-status-badge');
  if (statusBadge) {
    statusBadge.className = `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${meta.badgeClass}`;
    statusBadge.innerHTML = `<div class="w-1.5 h-1.5 rounded-full ${meta.dotClass} mr-1.5"></div>${meta.label}`;
  }

  // Custom Tag
  const customTag = document.getElementById('rm-custom-tag');
  if (customTag) {
    if (isCustomRemarks) {
      customTag.classList.remove('hidden');
    } else {
      customTag.classList.add('hidden');
    }
  }

  // Text Fields
  const plantEl = document.getElementById('rm-plant');
  if (plantEl) plantEl.textContent = row.plant || 'Untitled Plant';

  const permitEl = document.getElementById('rm-permit');
  if (permitEl) permitEl.textContent = row.permit || 'Permit';

  const remarksEl = document.getElementById('rm-remarks-text');
  if (remarksEl) remarksEl.textContent = remarksText || 'No remarks recorded.';

  const lawEl = document.getElementById('rm-environmental_law');
  if (lawEl) lawEl.textContent = row.environmental_law || '—';

  const permitNoEl = document.getElementById('rm-permit_no');
  if (permitNoEl) permitNoEl.textContent = row.permit_no || '—';

  const unitEl = document.getElementById('rm-unit_coverage');
  if (unitEl) unitEl.textContent = row.unit_coverage || '—';

  const descEl = document.getElementById('rm-description');
  if (descEl) descEl.textContent = row.description || '—';

  const dateIssuedEl = document.getElementById('rm-date_issued');
  if (dateIssuedEl) dateIssuedEl.textContent = formatDateDisplay(row.date_issued);

  const expiryEl = document.getElementById('rm-expiry');
  if (expiryEl) expiryEl.textContent = formatDateDisplay(row.expiry);

  // Edit Button in Remarks Modal
  const editBtn = document.getElementById('rm-edit-btn');
  if (editBtn) {
    editBtn.onclick = () => {
      closeRemarksModal();
      openPermitModal(row.id);
    };
  }

  modal.classList.remove('hidden');
  document.body.classList.add('overflow-hidden');
}

function closeRemarksModal() {
  const modal = document.getElementById('remarks-modal');
  if (modal) modal.classList.add('hidden');
  document.body.classList.remove('overflow-hidden');
}

function deleteRow(id) {
  rows = rows.filter(r => r.id !== id);
  saveData();
  renderTable();
  showToast('Permit removed');
}

// ==========================================
// Add / Edit Permit Modal
// ==========================================
function openPermitModal(rowId = null) {
  closeAllDropdowns();
  const modal = document.getElementById('permit-modal');
  const title = document.getElementById('modal-title');
  const form = document.getElementById('permit-form');
  if (!modal || !form) return;

  form.reset();
  document.getElementById('modal-row-id').value = rowId || '';

  if (rowId) {
    const row = rows.find(r => r.id === rowId);
    if (row) {
      if (title) title.textContent = 'Edit Permit Details';
      document.getElementById('m-plant').value = row.plant || '';
      document.getElementById('m-environmental_law').value = row.environmental_law || '';
      document.getElementById('m-description').value = row.description || '';
      document.getElementById('m-permit').value = row.permit || '';
      document.getElementById('m-unit_coverage').value = row.unit_coverage || '';
      document.getElementById('m-permit_no').value = row.permit_no || '';
      document.getElementById('m-date_issued').value = row.date_issued || '';
      document.getElementById('m-expiry').value = row.expiry || '';
      document.getElementById('m-remarks').value = row.remarks || '';
    }
  } else {
    if (title) title.textContent = 'Add New Permit';
  }

  modal.classList.remove('hidden');
  document.body.classList.add('overflow-hidden');
  setTimeout(() => {
    document.getElementById('m-plant')?.focus();
  }, 100);
}

function closePermitModal() {
  const modal = document.getElementById('permit-modal');
  if (modal) modal.classList.add('hidden');
  document.body.classList.remove('overflow-hidden');
}

function savePermitModal(event) {
  event.preventDefault();
  const rowIdVal = document.getElementById('modal-row-id').value;
  const isEdit = Boolean(rowIdVal);
  const rowId = isEdit ? parseInt(rowIdVal, 10) : nextId++;

  const plant = document.getElementById('m-plant').value.trim();
  const environmental_law = document.getElementById('m-environmental_law').value.trim();
  const description = document.getElementById('m-description').value.trim();
  const permit = document.getElementById('m-permit').value.trim();
  const unit_coverage = document.getElementById('m-unit_coverage').value.trim();
  const permit_no = document.getElementById('m-permit_no').value.trim();
  const date_issued = document.getElementById('m-date_issued').value;
  const expiry = document.getElementById('m-expiry').value;
  const remarks = document.getElementById('m-remarks').value.trim();

  if (!plant && !permit) {
    alert('Please enter at least a Powerplant Name or Permit description.');
    return;
  }

  const remarksAuto = remarks === '';

  const permitData = {
    id: rowId,
    plant,
    environmental_law,
    description,
    permit,
    unit_coverage,
    permit_no,
    date_issued,
    expiry,
    remarks: remarksAuto && expiry ? getRemarks(getMonthsDiff(expiry)) : remarks,
    remarksAuto
  };

  if (isEdit) {
    const index = rows.findIndex(r => r.id === rowId);
    if (index !== -1) {
      rows[index] = permitData;
      showToast('Permit updated successfully');
    }
  } else {
    rows.unshift(permitData);
    showToast('New permit added');
  }

  saveData();
  renderTable();
  closePermitModal();
}

// ==========================================
// CSV Export & Import
// ==========================================
function exportCSV() {
  if (rows.length === 0) {
    showToast('Nothing to export');
    return;
  }

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
    'Remarks'
  ];

  const csvRows = rows.map(r => {
    const months = getMonthsDiff(r.expiry);
    const autoRemarks = getRemarks(months);
    const remarks = (r.remarksAuto === false && r.remarks) ? r.remarks : autoRemarks;
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
      remarksWithCode
    ].map(v => `"${(v || '').replace(/"/g, '""')}"`).join(',');
  });

  const csv = [headers.join(','), ...csvRows].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `powerplant_permits_${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
  showToast('CSV exported successfully');
}

function parseCSVText(text) {
  const table = [];
  let row = [];
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

function normalizeDateStr(str) {
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

function importCSV(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = e => {
    try {
      const table = parseCSVText(String(e.target.result));
      if (table.length < 2) {
        showToast('CSV has no data rows');
        return;
      }

      const header = table[0].map(h => h.trim().toLowerCase());
      const colIndex = name => header.indexOf(name);
      const col = {
        plant: colIndex('powerplant name'),
        environmental_law: colIndex('environmental law'),
        description: colIndex('description'),
        permit: colIndex('permit'),
        unit_coverage: colIndex('unit / coverage'),
        permit_no: colIndex('permit no.') !== -1 ? colIndex('permit no.') : colIndex('permit no'),
        date_issued: colIndex('date issued'),
        expiry: colIndex('expiry date'),
        remarks: colIndex('remarks')
      };

      if (col.plant === -1 && col.permit === -1) {
        showToast("CSV headers don't match expected permit format");
        return;
      }

      const get = (r, key) => (col[key] > -1 && r[col[key]] !== undefined) ? r[col[key]].trim() : '';
      let imported = 0;

      for (let i = 1; i < table.length; i++) {
        const r = table[i];
        if (!r || r.every(c => (c || '').trim() === '')) continue;

        const expiry = normalizeDateStr(get(r, 'expiry'));
        const date_issued = normalizeDateStr(get(r, 'date_issued'));
        let remarks = get(r, 'remarks').replace(/^\[(GREEN|ORANGE|RED|GRAY)\]\s*/i, '');
        const autoText = getRemarks(getMonthsDiff(expiry));
        const remarksAuto = (remarks === '' || remarks === autoText);

        rows.push({
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
          remarksAuto
        });
        imported++;
      }

      if (imported === 0) {
        showToast('No permit rows found');
        return;
      }

      saveData();
      renderTable();
      showToast(`Imported ${imported} permit${imported !== 1 ? 's' : ''}`);
    } catch (err) {
      console.error('Error importing CSV:', err);
      showToast('Failed to import CSV');
    } finally {
      event.target.value = '';
    }
  };
  reader.onerror = () => showToast('Could not read file');
  reader.readAsText(file);
}

// ==========================================
// Utilities
// ==========================================
function esc(str) {
  return (str || '').toString()
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function showToast(msg) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.remove('opacity-0', 'translate-y-4');
  t.classList.add('opacity-100', 'translate-y-0');
  setTimeout(() => {
    t.classList.remove('opacity-100', 'translate-y-0');
    t.classList.add('opacity-0', 'translate-y-4');
  }, 2500);
}

// ==========================================
// Initialization
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  loadData();
  renderTable();
});
