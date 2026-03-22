const express = require('express');
const fieldDefinitionsController = require('../controllers/fieldDefinitionsController');

const router = express.Router();

router.get('/', fieldDefinitionsController.getAll, (req, res) => {
  res.status(200).json(res.locals.fieldDefinitions);
});

router.post('/', fieldDefinitionsController.add, (req, res) => {
  res.status(200).json(res.locals.fieldDefinition);
});

router.put('/:id', fieldDefinitionsController.update, (req, res) => {
  res.status(200).json(res.locals.fieldDefinition);
});

router.delete('/:id', fieldDefinitionsController.delete, (req, res) => {
  res.sendStatus(200);
});

module.exports = router;
