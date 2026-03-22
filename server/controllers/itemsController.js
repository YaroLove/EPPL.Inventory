const { Item } = require('../models/itemsModels');

const itemsController = {};

const ALLOWED_DISTINCT_TOP_LEVEL = new Set([
  'category',
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
  'expirationDate',
  'lastMaintenance',
  'calibration',
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
    .catch((err) => {
      next({ code: 500, error: err });
    });
};

itemsController.getItems = (req, res, next) => {
  Item.find({ category: req.params.category })
    .exec()
    .then((items) => {
      res.locals.items = items;
      next();
    })
    .catch((err) => {
      next({ code: 500, error: err });
    });
};

itemsController.getAllItems = (req, res, next) => {
  Item.find()
    .exec()
    .then((items) => {
      res.locals.items = items;
      next();
    })
    .catch((err) => {
      next({ code: 500, error: err });
    });
};

itemsController.getItemsBySupplier = (req, res, next) => {
  Item.find({ supplier: req.params.supplier })
    .exec()
    .then((items) => {
      res.locals.items = items;
      next();
    })
    .catch((err) => {
      next({ code: 500, error: err });
    });
};

itemsController.addItem = (req, res, next) => {
  Item.create({ ...req.body, category: req.params.category })
    .then(() => next())
    .catch((err) => {
      next({ code: 500, error: err });
    });
};

itemsController.deleteItem = (req, res, next) => {
  Item.deleteOne({ _id: req.params.id })
    .exec()
    .then(() => next())
    .catch((err) => {
      next({ code: 500, error: err });
    });
};

itemsController.updateItem = (req, res, next) => {
  Item.findOneAndUpdate({ _id: req.params.id }, req.body)
    .exec()
    .then(() => next())
    .catch((err) => {
      next({ code: 500, error: err });
    });
};

module.exports = itemsController;
