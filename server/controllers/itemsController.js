const { Item } = require('../models/itemsModels');

const itemsController = {};

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
