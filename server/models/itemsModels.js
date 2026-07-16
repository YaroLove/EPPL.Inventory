const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI;

// Explicitly pin the database name so it can never silently fall back to the
// MongoDB default ("test"). All existing data lives in the "test" database.
const MONGO_DB_NAME = process.env.MONGO_DB_NAME || 'test';

mongoose
  .connect(MONGO_URI, { dbName: MONGO_DB_NAME })
  .then(() => {
    console.log(`Connected to Mongo DB (database: ${mongoose.connection.name}).`);
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err.message);
    console.log('Server will continue without database connection...');
  });

const Schema = mongoose.Schema;

const ItemSchema = new Schema({
  category: { type: String, required: true, index: true },
  name: String,
  itemType: String,
  sizeDimension: String,
  catalog: String,
  supplier: { type: String, index: true },
  description: String,
  quantity: Number,
  quantityUnit: { type: String, default: 'items' },
  minStock: Number,
  expirationDate: Date,
  location: String,
  manualUrl: String,
  image: String,
  lastMaintenance: Date,
  calibration: Date,
  species: String,
  lastFreeze: String,
  customFields: { type: Map, of: Schema.Types.Mixed },
});

const Item = mongoose.model('Item', ItemSchema);

const FIELD_TYPES = [
  'text',
  'number',
  'date',
  'select_category',
  'select_supplier',
  'quantity_with_unit',
  'upload',
];

const FieldDefinitionSchema = new Schema({
  label: { type: String, required: true },
  fieldKey: { type: String, required: true, unique: true },
  fieldType: { type: String, enum: FIELD_TYPES, default: 'text' },
  required: { type: Boolean, default: false },
  order: { type: Number, default: 0 },
  section: { type: String, enum: ['required', 'optional'], default: 'optional' },
  builtin: { type: Boolean, default: false },
  hidden: { type: Boolean, default: false },
});

const FieldDefinition = mongoose.model('FieldDefinition', FieldDefinitionSchema);

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
  FieldDefinition,
  FIELD_TYPES,
};
