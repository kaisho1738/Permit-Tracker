# Permit Expiry Tracker

A lightweight, browser-based tool for monitoring powerplant permit validity. No installation, no server, no database — just open the file and start tracking.

---

## Overview

Managing permit renewals across multiple powerplants is easy to overlook until it's too late. The Permit Expiry Tracker solves this by giving your team a single, always-up-to-date view of every permit's status — color-coded so critical items are impossible to miss.

The app runs entirely inside your browser as a single `.html` file. Your data is saved automatically using the browser's built-in local storage, which means it persists between sessions without needing any backend, cloud service, or internet connection after the first load.

---

## Features

- **Color-coded status badges** — Green for safe (6+ months), Amber for expiring soon (3–6 months), Red for critical or already expired (under 3 months)
- **Live remarks** — Automatically calculates and displays how many months and days remain, or how long ago a permit expired
- **Summary dashboard** — At-a-glance count of total, safe, expiring, and critical permits at the top of the page
- **Inline editing** — Click directly on any cell to edit. No popups, no save buttons
- **Search** — Filter permits instantly by company name or permit type
- **Sortable columns** — Click any column header to sort ascending or descending
- **Excel export** — Download all permit data as a color-coded `.xlsx` file, with Remarks and Status cells highlighted in their respective colors
- **Auto-save** — Every change is saved to local storage immediately. Data survives page refreshes and browser restarts
- **No installation required** — Works on any modern browser (Chrome, Edge, Firefox, Safari)

---

## How to Use

### Opening the App

1. Locate the `permit_tracker.html` file on your computer
2. Double-click it — it will open in your default browser
3. That's it. The app is ready to use

> You can also place the file in a shared folder (e.g. OneDrive, SharePoint) so teammates can access it. Note that each person's data is stored in their own browser — see the [Data & Storage](#data--storage) section for details.

---

### Adding a Permit

1. Click the **Add Permit** button in the top-right corner
2. A new blank row will appear at the bottom of the table with the cursor ready in the first field
3. Type the **Company Name** (e.g. *Batangas Power Corp*)
4. Press `Tab` to move to the **Permit** field and enter the permit type or reference number (e.g. *Permit to Operate*)
5. Click the **Expiry Date** field and pick a date from the calendar picker
6. The **Remarks** column will automatically update with the status badge and time remaining

---

### Editing a Permit

Click directly on any cell in the table to edit its value. Changes are saved automatically as soon as you click away or press `Tab`.

---

### Deleting a Permit

Click the **×** button on the right side of the row you want to remove. A confirmation toast will appear at the bottom of the screen.

---

### Searching

Type in the **search bar** in the toolbar to filter rows. The search matches against both the Company Name and the Permit columns. The row count in the toolbar updates to show how many results are visible.

---

### Sorting

Click any column header (**Company Name**, **Permit**, or **Expiry Date**) to sort the table by that column. Click the same header again to reverse the sort order. An arrow indicator (↑ or ↓) shows the current sort direction.

The table defaults to sorting by **Expiry Date ascending** so the soonest-expiring permits always appear at the top.

---

### Exporting to Excel

1. Click the **Export Excel** button in the top-right corner
2. A `.xlsx` file named `permits_YYYY-MM-DD.xlsx` will download automatically
3. Open it in Microsoft Excel or Google Sheets

The exported file includes:
- A styled header row (blue background, white text)
- The **Remarks** and **Status** columns color-coded in green, amber, or red — matching what you see in the app
- Alternating row stripes on the other columns for readability

---

## Understanding the Status Colors

| Color | Meaning | Trigger |
|---|---|---|
| 🟢 Green | Safe | 6 or more months until expiry |
| 🟡 Amber | Expiring Soon | Between 3 and 6 months until expiry |
| 🔴 Red | Critical or Expired | Less than 3 months remaining, or already past the expiry date |
| ⚪ Gray | No Date Set | Expiry date has not been entered yet |

---

## Data & Storage

All data is stored in your browser's **local storage** — a small, private storage area built into every modern browser.

**What this means in practice:**

- Data is saved **per browser, per machine**. If you use Chrome on your laptop, the data lives in Chrome on that laptop only
- Switching to Edge, Firefox, or a different computer will show an empty table
- Clearing your browser's site data or cache will erase the saved permits
- There is no sync between devices or users — each person who opens the file has their own separate data

**Recommended workflow for teams:** One designated person maintains the master copy and shares an exported Excel file with the team periodically, or the file is kept on a shared drive and each member maintains their own local copy.

---

## Requirements

- Any modern browser: **Google Chrome**, **Microsoft Edge**, **Firefox**, or **Safari**
- An internet connection is only needed on first load to fetch the Google Fonts stylesheet. All functionality works offline after that

---

## File Structure

```
permit_tracker.html    ← The entire application. One file, self-contained.
```

There are no other files, folders, dependencies, or configuration needed.

---

## Future Improvements (When Ready to Scale)

When the app outgrows local storage — for example, when multiple users need to share one master list — the following upgrades can be made without rewriting the frontend:

- Connect to a backend API (Node.js, Python, Laravel, etc.) and replace the `loadData()` and `saveData()` functions
- Add a database (PostgreSQL, MySQL) with a `permits` table matching the four columns
- Deploy on Vercel, Netlify, or any static host with a REST API backend

The data layer is already clearly marked in the source code for this exact purpose.
