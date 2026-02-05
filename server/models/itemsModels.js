const mongoose = require('mongoose');

const MONGO_URI =
  'mongodb+srv://YarosLove:XGMO1hFlok32QVRe@eppl.qwmnrw1.mongodb.net/storeroomDB?retryWrites=true&w=majority&appName=EPPL';

mongoose
  .connect(MONGO_URI)
  .then(() => console.log('Connected to Mongo DB.'))
  .catch((err) => {
    console.error('MongoDB connection error:', err.message);
    console.log('Server will continue without database connection...');
  });

const Schema = mongoose.Schema;

const consumableSchema = new Schema({
  name: String,
  catalog: String,
  supplier: String,
  description: String,
  quantity: Number,
  minStock: Number,
  expirationDate: Date,
  location: String,
  manualUrl: String,
  image: String,
  lastMaintenance: Date,
  calibration: Date,
});
const Consumable = mongoose.model('Consumable', consumableSchema);

const reagentSchema = new Schema({
  name: String,
  catalog: String,
  supplier: String,
  description: String,
  quantity: Number,
  minStock: Number,
  expirationDate: Date,
  location: String,
  manualUrl: String,
  image: String,
  lastMaintenance: Date,
  calibration: Date,
});
const Reagent = mongoose.model('Reagent', reagentSchema);

const cellSchema = new Schema({
  name: String,
  catalog: String,
  supplier: String,
  species: String,
  description: String,
  lastFreeze: String,
  quantity: Number,
  minStock: Number,
  expirationDate: Date,
  location: String,
  manualUrl: String,
  image: String,
  lastMaintenance: Date,
  calibration: Date,
});
const Cell = mongoose.model('Cell', cellSchema);

const equipmentSchema = new Schema({
  name: String,
  catalog: String,
  supplier: String,
  description: String,
  lastMaintenance: Date,
  calibration: Date,
  minStock: Number,
  expirationDate: Date,
  location: String,
  manualUrl: String,
  image: String,
  quantity: Number,
});
const Equipment = mongoose.model('Equipment', equipmentSchema);

module.exports = {
  Consumable,
  Reagent,
  Cell,
  Equipment,
};
