const express = require('express');
const itemsController = require('../controllers/itemsController');

const router = express.Router();

router.get('/', itemsController.getAllItems, (req, res) => {
  res.status(200).json(res.locals.items);
});

router.get('/by-supplier/:supplier', itemsController.getItemsBySupplier, (req, res) => {
  res.status(200).json(res.locals.items);
});

router.get('/distinct/:field', itemsController.getDistinctValues, (req, res) => {
  res.status(200).json(res.locals.distinctValues);
});

router.get('/:category', itemsController.getItems, (req, res) => {
  res.status(200).json(res.locals.items);
});

router.post('/:category', itemsController.addItem, (req, res) => {
  res.sendStatus(200);
});

router.delete('/:category/:id', itemsController.deleteItem, (req, res) => {
  res.sendStatus(200);
});

router.put('/:category/:id', itemsController.updateItem, (req, res) => {
  res.sendStatus(200);
});

module.exports = router;
