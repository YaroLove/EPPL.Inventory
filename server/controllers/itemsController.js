const { Item } = require('../models/itemsModels');
const ActionLog = require('../models/actionLogModel');

const itemsController = {};

const ALLOWED_DISTINCT_TOP_LEVEL = new Set([
  'category', 'name', 'itemType', 'sizeDimension', 'catalog', 'supplier',
  'description', 'quantity', 'quantityUnit', 'minStock', 'location', 'species',
  'lastFreeze', 'manualUrl', 'expirationDate', 'lastMaintenance', 'calibration',
]);

function resolveDistinctPath(paramField) {
  let path = decodeURIComponent(paramField || '');
  if (path.startsWith('customFields__')) {
    const key = path.slice('customFields__'.length);
    if (!key || /[^a-zA-Z0-9_-]/.test(key)) return null;
    return `customFields.${key}`;
  }
  if (ALLOWED_DISTINCT_TOP_LEVEL.has(path)) return path;
  return null;
}

function logAction(req, itemId, itemName, action) {
  const userId = req.user?._id;
  const username = req.user?.displayName || req.user?.email || 'Unknown';
  ActionLog.create({ userId, username, itemId: String(itemId), itemName, action }).catch(() => {});
}

itemsController.getDistinctValues = (req, res, next) => {
  const path = resolveDistinctPath(req.params.field);
  if (!path) {
    return next({ code: 400, error: 'Invalid or unsupported field for distinct values' });
  }
  Item.distinct(path)
    .exec()
    .then((values) => {
      const cleaned = values.filter(
        (v) => v !== null && v !== undefined && String(v).trim() !== ''
      );
      res.locals.distinctValues = cleaned.map((v) =>
        v instanceof Date ? v.toISOString() : String(v)
      );
      next();
    })
    .catch((err) => next({ code: 500, error: err }));
};

itemsController.getItems = (req, res, next) => {
  Item.find({ category: req.params.category })
    .exec()
    .then((items) => { res.locals.items = items; next(); })
    .catch((err) => next({ code: 500, error: err }));
};

itemsController.getAllItems = (req, res, next) => {
  Item.find()
    .exec()
    .then((items) => { res.locals.items = items; next(); })
    .catch((err) => next({ code: 500, error: err }));
};

itemsController.getItemsBySupplier = (req, res, next) => {
  Item.find({ supplier: req.params.supplier })
    .exec()
    .then((items) => { res.locals.items = items; next(); })
    .catch((err) => next({ code: 500, error: err }));
};

itemsController.addItem = async (req, res, next) => {
  try {
    const item = await Item.create({ ...req.body, category: req.params.category });
    const name = [item.name, item.itemType, item.sizeDimension].filter(Boolean).join(' - ') || 'New Item';
    logAction(req, item._id, name, 'added');
    next();
  } catch (err) {
    next({ code: 500, error: err });
  }
};

itemsController.deleteItem = async (req, res, next) => {
  try {
    const item = await Item.findById(req.params.id);
    if (item) {
      const name = [item.name, item.itemType, item.sizeDimension].filter(Boolean).join(' - ') || 'Unknown';
      logAction(req, item._id, name, 'deleted');
    }
    await Item.deleteOne({ _id: req.params.id });
    next();
  } catch (err) {
    next({ code: 500, error: err });
  }
};

itemsController.updateItem = async (req, res, next) => {
  try {
    const item = await Item.findById(req.params.id);
    if (item) {
      const name = [item.name, item.itemType, item.sizeDimension].filter(Boolean).join(' - ') || 'Unknown';
      const isQtyOnly = Object.keys(req.body).length === 1 && req.body.quantity !== undefined;
      logAction(req, item._id, name, isQtyOnly ? 'updated' : 'edited');
    }
    await Item.findOneAndUpdate({ _id: req.params.id }, req.body);
    next();
  } catch (err) {
    next({ code: 500, error: err });
  }
};

module.exports = itemsController;
