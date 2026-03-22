const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const actionLogSchema = new Schema({
  userId:    { type: Schema.Types.ObjectId, ref: 'User' },
  username:  { type: String, default: 'Unknown' },
  itemId:    { type: String },
  itemName:  { type: String, default: 'Unknown Item' },
  action:    { type: String, enum: ['added', 'deleted', 'updated', 'edited'], required: true },
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model('ActionLog', actionLogSchema);
