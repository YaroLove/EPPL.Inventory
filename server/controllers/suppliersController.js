const { Supplier } = require('../models/itemsModels');

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
  Supplier.create({ name: req.body.name })
    .then((supplier) => {
      res.locals.supplier = supplier;
      next();
    })
    .catch((err) => {
      next({ code: 500, error: err });
    });
};

suppliersController.delete = (req, res, next) => {
  Supplier.deleteOne({ _id: req.params.id })
    .exec()
    .then(() => next())
    .catch((err) => {
      next({ code: 500, error: err });
    });
};

module.exports = suppliersController;
