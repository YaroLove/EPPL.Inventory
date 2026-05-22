const express = require('express');
const categoriesController = require('../controllers/categoriesController');

const router = express.Router();

router.get('/', categoriesController.getAll, (req, res) => {
  res.status(200).json(res.locals.categories);
});

router.post('/', categoriesController.add, (req, res) => {
  res.status(200).json(res.locals.category);
});

router.put('/:id', categoriesController.update, (req, res) => {
  res.status(200).json(res.locals.category);
});

router.delete('/:id', categoriesController.delete, (req, res) => {
  res.status(200).json({ success: true });
});

module.exports = router;
