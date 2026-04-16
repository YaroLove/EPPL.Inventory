const express = require('express');
const suppliersController = require('../controllers/suppliersController');

const router = express.Router();

router.get('/', suppliersController.getAll, (req, res) => {
  res.status(200).json(res.locals.suppliers);
});

router.post('/', suppliersController.add, (req, res) => {
  res.status(200).json(res.locals.supplier);
});

router.delete('/:id', suppliersController.delete, (req, res) => {
  res.status(200).json({ success: true });
});

module.exports = router;
