const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  email:        { type: String, required: true, unique: true, lowercase: true, trim: true },
  password:     { type: String, required: true },
  role:         { type: String, enum: ['admin', 'user'], default: 'user' },
  displayName:  { type: String, default: '' },
  tempPassword: { type: Boolean, default: false },
  favorites:    [{ type: Schema.Types.ObjectId, ref: 'Item' }],
  settings: {
    lowStockThreshold:      { type: Number, default: 5 },
    expirationWarningDays:  { type: Number, default: 30 },
    displayMode:            { type: String, enum: ['cards', 'table'], default: 'cards' },
  },
});

module.exports = mongoose.model('User', userSchema);
