function isLowStock(item) {
  if (!item) return false;
  const raw = item.minStock;
  if (raw === undefined || raw === null || raw === '') return false;
  const min = Number(raw);
  if (Number.isNaN(min)) return false;
  return item.quantity !== undefined && item.quantity !== null && Number(item.quantity) <= min;
}

module.exports = { isLowStock };
