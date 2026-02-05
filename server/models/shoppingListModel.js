const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const shoppingListSchema = new Schema({
    name: { type: String, required: true },
    addedBy: String,
    createdAt: { type: Date, default: Date.now },
    isBought: { type: Boolean, default: false },
});

const ShoppingList = mongoose.model('ShoppingList', shoppingListSchema);

module.exports = ShoppingList;
