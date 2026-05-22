const { Category, Item } = require('../models/itemsModels');

const categoriesController = {};

categoriesController.getAll = (req, res, next) => {
  Category.find()
    .sort({ name: 1 })
    .exec()
    .then((categories) => {
      res.locals.categories = categories;
      next();
    })
    .catch((err) => {
      next({ code: 500, error: err });
    });
};

categoriesController.add = (req, res, next) => {
  const name = (req.body.name || '').trim();
  if (!name) return next({ code: 400, error: 'Name is required' });

  Category.create({ name })
    .then((category) => {
      res.locals.category = category;
      next();
    })
    .catch((err) => {
      if (err.code === 11000) return next({ code: 409, error: 'Category already exists' });
      next({ code: 500, error: err });
    });
};

categoriesController.update = async (req, res, next) => {
  const name = (req.body.name || '').trim();
  if (!name) return next({ code: 400, error: 'Name is required' });

  try {
    const doc = await Category.findById(req.params.id);
    if (!doc) return next({ code: 404, error: 'Category not found' });

    const oldName = doc.name;
    if (oldName === name) {
      res.locals.category = doc;
      return next();
    }

    const duplicate = await Category.findOne({ name, _id: { $ne: doc._id } });
    if (duplicate) return next({ code: 409, error: 'Category name already in use' });

    doc.name = name;
    await doc.save();
    await Item.updateMany({ category: oldName }, { $set: { category: name } });

    res.locals.category = doc;
    next();
  } catch (err) {
    next({ code: 500, error: err });
  }
};

categoriesController.delete = async (req, res, next) => {
  try {
    const doc = await Category.findById(req.params.id);
    if (!doc) return next({ code: 404, error: 'Category not found' });

    const itemCount = await Item.countDocuments({ category: doc.name });
    const reassignTo = (req.body?.reassignTo || req.query?.reassignTo || '').trim();

    if (itemCount > 0 && !reassignTo) {
      return next({
        code: 400,
        error: `${itemCount} item(s) use this category. Choose a category to reassign them to.`,
        itemCount,
      });
    }

    if (itemCount > 0) {
      if (reassignTo === doc.name) {
        return next({ code: 400, error: 'Reassign target must be different from this category' });
      }
      const target = await Category.findOne({ name: reassignTo });
      if (!target) {
        return next({ code: 400, error: 'Reassign target category does not exist' });
      }
      await Item.updateMany({ category: doc.name }, { $set: { category: reassignTo } });
    }

    await Category.deleteOne({ _id: doc._id });
    next();
  } catch (err) {
    next({ code: 500, error: err });
  }
};

module.exports = categoriesController;
