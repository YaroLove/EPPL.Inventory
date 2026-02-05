const express = require('express');
const shoppingListController = require('../controllers/shoppingListController');

const router = express.Router();

router.get('/', shoppingListController.getItems, (req, res) => {
    res.status(200).json(res.locals.items);
});

router.post('/', shoppingListController.addItem, (req, res) => {
    res.status(200).json(res.locals.item);
});

router.put('/:id', shoppingListController.updateItem, (req, res) => {
    res.status(200).json(res.locals.item);
});

router.delete('/:id', shoppingListController.deleteItem, (req, res) => {
    res.sendStatus(200);
});

module.exports = router;
