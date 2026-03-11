const { Category } = require('../models/itemsModels');

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
  Category.create({ name: req.body.name })
    .then((category) => {
      res.locals.category = category;
      next();
    })
    .catch((err) => {
      next({ code: 500, error: err });
    });
};

categoriesController.delete = (req, res, next) => {
  Category.deleteOne({ _id: req.params.id })
    .exec()
    .then(() => next())
    .catch((err) => {
      next({ code: 500, error: err });
    });
};

module.exports = categoriesController;
