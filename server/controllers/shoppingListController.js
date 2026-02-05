const ShoppingList = require('../models/shoppingListModel');

const shoppingListController = {};

shoppingListController.getItems = (req, res, next) => {
  ShoppingList.find()
    .sort({ createdAt: -1 })
    .exec()
    .then((items) => {
      res.locals.items = items;
      return next();
    })
    .catch((err) =>
      next({
        code: 500,
        error: err,
      })
    );
};

shoppingListController.addItem = (req, res, next) => {
  ShoppingList.create(req.body)
    .then((item) => {
      res.locals.item = item;
      return next();
    })
    .catch((err) =>
      next({
        code: 500,
        error: err,
      })
    );
};

shoppingListController.updateItem = (req, res, next) => {
  const itemId = req.params.id;

  ShoppingList.findByIdAndUpdate(itemId, req.body, { new: true })
    .exec()
    .then((item) => {
      res.locals.item = item;
      return next();
    })
    .catch((err) =>
      next({
        code: 500,
        error: err,
      })
    );
};

shoppingListController.deleteItem = (req, res, next) => {
  const itemId = req.params.id;

  ShoppingList.deleteOne({ _id: itemId })
    .exec()
    .then(() => next())
    .catch((err) =>
      next({
        code: 500,
        error: err,
      })
    );
};

module.exports = shoppingListController;
