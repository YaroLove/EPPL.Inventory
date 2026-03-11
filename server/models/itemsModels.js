const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI;

mongoose
  .connect(MONGO_URI)
  .then(() => console.log('Connected to Mongo DB.'))
  .catch((err) => {
    console.error('MongoDB connection error:', err.message);
    console.log('Server will continue without database connection...');
  });

const Schema = mongoose.Schema;

const ItemSchema = new Schema({
  category: { type: String, required: true, index: true },
  name: String,
  catalog: String,
  supplier: { type: String, index: true },
  description: String,
  quantity: Number,
  minStock: Number,
  expirationDate: Date,
  location: String,
  manualUrl: String,
  image: String,
  lastMaintenance: Date,
  calibration: Date,
  species: String,
  lastFreeze: String,
});

const Item = mongoose.model('Item', ItemSchema);

const CategorySchema = new Schema({
  name: { type: String, required: true, unique: true },
});

const Category = mongoose.model('Category', CategorySchema);

const SupplierSchema = new Schema({
  name: { type: String, required: true, unique: true },
});

const Supplier = mongoose.model('Supplier', SupplierSchema);

module.exports = {
  Item,
  Category,
  Supplier,
};
