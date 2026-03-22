export const QUANTITY_UNITS = [
  'items',
  'boxes',
  'oz',
  'ml',
  'L',
  'packs',
  'rolls',
  'pairs',
  'vials',
  'kits',
];

const TOP_LEVEL_KEYS = [
  'name',
  'itemType',
  'sizeDimension',
  'catalog',
  'supplier',
  'description',
  'quantity',
  'quantityUnit',
  'minStock',
  'location',
  'species',
  'lastFreeze',
  'manualUrl',
  'image',
  'expirationDate',
  'lastMaintenance',
  'calibration',
];

export function isCustomFieldKey(fieldKey) {
  return fieldKey && fieldKey.startsWith('custom_');
}

export function customMapKey(fieldKey) {
  return fieldKey.replace(/^custom_/, '');
}

export function buildItemPayload(values, category) {
  const flat = { category };

  TOP_LEVEL_KEYS.forEach((key) => {
    const v = values[key];
    if (key === 'quantity') {
      if (v !== undefined && v !== null && v !== '') {
        flat[key] = v;
      }
      return;
    }
    if (v !== undefined && v !== null && v !== '') {
      flat[key] = v;
    }
  });

  if (values.quantity === 0 || values.quantity === '0') {
    flat.quantity = Number(values.quantity);
  }

  const customFields = {};
  Object.keys(values).forEach((key) => {
    if (key.startsWith('custom_')) {
      const mapKey = customMapKey(key);
      const v = values[key];
      if (v !== undefined && v !== null && v !== '') {
        customFields[mapKey] = v;
      }
    }
  });
  if (Object.keys(customFields).length > 0) {
    flat.customFields = customFields;
  }
  return flat;
}

export function itemToFormValues(item) {
  if (!item) return {};
  const v = { ...item };
  delete v._id;
  delete v.__v;
  if (item.customFields && item.customFields instanceof Map) {
    item.customFields.forEach((val, key) => {
      v[`custom_${key}`] = val;
    });
  } else if (item.customFields && typeof item.customFields === 'object') {
    Object.entries(item.customFields).forEach(([key, val]) => {
      v[`custom_${key}`] = val;
    });
  }
  delete v.customFields;
  return v;
}

export function combinedItemTitle(item) {
  if (!item) return '';
  return [item.name, item.itemType, item.sizeDimension].filter(Boolean).join(' - ');
}
