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

const MedCartSchema = new Schema({
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
const MedCart = mongoose.model('MedCart', MedCartSchema);

const PowerLabSchema = new Schema({
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
const PowerLab = mongoose.model('PowerLab', PowerLabSchema);

const PhysioflowSchema = new Schema({
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
const Physioflow = mongoose.model('Physioflow', PhysioflowSchema);

const BloodworkSchema = new Schema({
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
const Bloodwork = mongoose.model('Bloodwork', BloodworkSchema);

module.exports = {
  MedCart,
  PowerLab,
  Physioflow,
  Bloodwork,
};
