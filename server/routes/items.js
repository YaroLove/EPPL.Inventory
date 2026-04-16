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
  res.status(200).json({ success: true });
});

router.delete('/:category/:id', itemsController.deleteItem, (req, res) => {
  res.status(200).json({ success: true });
});

router.put('/:category/:id', itemsController.updateItem, (req, res) => {
  res.status(200).json({ success: true });
});

module.exports = router;
