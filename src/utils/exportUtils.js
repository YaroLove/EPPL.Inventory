import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import moment from 'moment';

const DATE_FIELDS = ['expirationDate', 'lastMaintenance', 'calibration'];

function flattenItem(item) {
  const row = {};

  const title = [item.name, item.itemType, item.sizeDimension].filter(Boolean).join(' - ') || item.name || '';
  row['Title'] = title;
  row['Name'] = item.name || '';
  row['Type'] = item.itemType || '';
  row['Size/Dimension'] = item.sizeDimension || '';
  row['Category'] = item.category || '';
  row['Supplier'] = item.supplier || '';
  row['Catalog No.'] = item.catalog || '';
  row['Description'] = item.description || '';
  row['Quantity'] = item.quantity !== undefined ? item.quantity : '';
  row['Quantity Unit'] = item.quantityUnit || 'items';
  row['Min Stock'] = item.minStock !== undefined ? item.minStock : '';
  row['Location'] = item.location || '';
  row['Species'] = item.species || '';
  row['Last Freeze'] = item.lastFreeze || '';
  row['Manual URL'] = item.manualUrl || '';

  DATE_FIELDS.forEach((f) => {
    row[f.charAt(0).toUpperCase() + f.slice(1)] = item[f]
      ? moment(item[f]).format('YYYY-MM-DD')
      : '';
  });

  if (item.customFields) {
    const cf = typeof item.customFields === 'object' ? item.customFields : {};
    Object.entries(cf).forEach(([k, v]) => {
      row[`custom: ${k}`] = String(v ?? '');
    });
  }

  return row;
}

function getHeaders(rows) {
  const keys = new Set();
  rows.forEach((r) => Object.keys(r).forEach((k) => keys.add(k)));
  return Array.from(keys);
}

export function exportCsv(items, filename = 'inventory') {
  const rows = items.map(flattenItem);
  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Inventory');
  XLSX.writeFile(wb, `${filename}.csv`, { bookType: 'csv' });
}

export function exportXlsx(items, filename = 'inventory') {
  const rows = items.map(flattenItem);
  const ws = XLSX.utils.json_to_sheet(rows);

  // Auto column widths
  const headers = getHeaders(rows);
  ws['!cols'] = headers.map((h) => ({
    wch: Math.max(h.length + 2, 12),
  }));

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Inventory');
  XLSX.writeFile(wb, `${filename}.xlsx`);
}

export function exportPdf(items, title = 'Inventory Export', filename = 'inventory') {
  const doc = new jsPDF({ orientation: 'landscape' });
  const rows = items.map(flattenItem);

  if (rows.length === 0) return;

  const headers = getHeaders(rows);
  const body = rows.map((row) => headers.map((h) => row[h] ?? ''));

  doc.setFontSize(14);
  doc.setTextColor(20, 83, 45);
  doc.text(title, 14, 15);
  doc.setFontSize(9);
  doc.setTextColor(100);
  doc.text(`Exported ${moment().format('MMMM D, YYYY [at] h:mm A')} · ${items.length} items`, 14, 22);

  autoTable(doc, {
    head: [headers],
    body,
    startY: 28,
    styles: { fontSize: 7, cellPadding: 2 },
    headStyles: { fillColor: [20, 83, 45], textColor: 255, fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [245, 250, 245] },
    margin: { left: 10, right: 10 },
  });

  doc.save(`${filename}.pdf`);
}
