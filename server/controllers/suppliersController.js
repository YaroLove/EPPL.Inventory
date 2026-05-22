const { Supplier, Item } = require('../models/itemsModels');

const suppliersController = {};

suppliersController.getAll = (req, res, next) => {
  Supplier.find()
    .sort({ name: 1 })
    .exec()
    .then((suppliers) => {
      res.locals.suppliers = suppliers;
      next();
    })
    .catch((err) => {
      next({ code: 500, error: err });
    });
};

suppliersController.add = (req, res, next) => {
  const name = (req.body.name || '').trim();
  if (!name) return next({ code: 400, error: 'Name is required' });

  Supplier.create({ name })
    .then((supplier) => {
      res.locals.supplier = supplier;
      next();
    })
    .catch((err) => {
      if (err.code === 11000) return next({ code: 409, error: 'Supplier already exists' });
      next({ code: 500, error: err });
    });
};

suppliersController.update = async (req, res, next) => {
  const name = (req.body.name || '').trim();
  if (!name) return next({ code: 400, error: 'Name is required' });

  try {
    const doc = await Supplier.findById(req.params.id);
    if (!doc) return next({ code: 404, error: 'Supplier not found' });

    const oldName = doc.name;
    if (oldName === name) {
      res.locals.supplier = doc;
      return next();
    }

    const duplicate = await Supplier.findOne({ name, _id: { $ne: doc._id } });
    if (duplicate) return next({ code: 409, error: 'Supplier name already in use' });

    doc.name = name;
    await doc.save();
    await Item.updateMany({ supplier: oldName }, { $set: { supplier: name } });

    res.locals.supplier = doc;
    next();
  } catch (err) {
    next({ code: 500, error: err });
  }
};

suppliersController.delete = async (req, res, next) => {
  try {
    const doc = await Supplier.findById(req.params.id);
    if (!doc) return next({ code: 404, error: 'Supplier not found' });

    const itemCount = await Item.countDocuments({ supplier: doc.name });
    const reassignTo = (req.body?.reassignTo || req.query?.reassignTo || '').trim();

    if (itemCount > 0 && !reassignTo) {
      return next({
        code: 400,
        error: `${itemCount} item(s) use this supplier. Choose a supplier to reassign them to.`,
        itemCount,
      });
    }

    if (itemCount > 0) {
      if (reassignTo === doc.name) {
        return next({ code: 400, error: 'Reassign target must be different from this supplier' });
      }
      const target = await Supplier.findOne({ name: reassignTo });
      if (!target) {
        return next({ code: 400, error: 'Reassign target supplier does not exist' });
      }
      await Item.updateMany({ supplier: doc.name }, { $set: { supplier: reassignTo } });
    }

    await Supplier.deleteOne({ _id: doc._id });
    next();
  } catch (err) {
    next({ code: 500, error: err });
  }
};

module.exports = suppliersController;
