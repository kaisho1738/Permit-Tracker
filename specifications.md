# Permit Expiry Tracker — Project Specifications

## Overview

A browser-based permit expiry tracking system for powerplants. The application monitors permit validity periods and provides color-coded alerts to warn users of upcoming or past expirations. Data persists between sessions via local storage, with no backend or installation required.

---

## Functional Requirements

### Data Model

Each permit entry contains the following fields:

| Field | Type | Input By | Description |
|---|---|---|---|
| Company Name | Text | User | Name of the company associated with the permit |
| Permit | Text | User | Permit type or reference number |
| Expiry Date | Date | User | The date the permit expires |
| Remarks | Computed | System | Auto-generated status label based on expiry date |

### Remarks Logic

The Remarks field is computed automatically from the Expiry Date. The system calculates the difference between today's date and the expiry date and applies the following rules:

| Condition | Remarks Text | Color |
|---|---|---|
| 6 or more months remaining | "Expiring in N months" | Green |
| 3 to less than 6 months remaining | "Expiring in N months" | Yellow/Amber |
| Less than 3 months remaining | "Expiring in N months / N days" | Red |
| Already expired | "Expired N days ago" | Red |
| No date set | "Set a date" | Gray |

### Summary Dashboard

A summary bar at the top of the tracker displays:
- Total number of permits
- Count of permits in Safe status (green)
- Count of permits in Expiring Soon status (yellow)
- Count of permits in Expired / Critical status (red)

---

## Non-Functional Requirements

### Platform
- Runs entirely in a web browser (Chrome, Edge, Firefox, Safari)
- No installation, server, or internet connection required after initial delivery
- Delivered as a single `.html` file

### Persistence
- All permit data is saved to the browser's local storage
- Data survives page refreshes and browser restarts
- Data is stored locally per device (not synced across machines)

### Usability
- Inline editing — users click directly on a cell to edit
- New permit rows added via an "Add Permit" button
- Rows deletable via a remove button per row
- Color badges update in real time as the user types or changes a date

### Export
- CSV export button to download all permit data as a spreadsheet-compatible file

### Sorting
- Table sortable by Expiry Date (ascending/descending toggle)

---

## Out of Scope

- User authentication or login
- Multi-user or cloud sync
- Email or push notifications
- Mobile app or native desktop app
- Backend database

---

## Deliverable

A single `permit_tracker.html` file that can be opened in any modern browser, requires no setup, and works offline.

---

## Color Reference

| Status | Background | Text | Trigger |
|---|---|---|---|
| Safe | Green tint | Dark green | ≥ 6 months to expiry |
| Warning | Amber tint | Dark amber | 3–6 months to expiry |
| Critical / Expired | Red tint | Dark red | < 3 months or past expiry |
| No date | Gray tint | Gray | No expiry date entered |