const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const sessionSchema = new Schema({
  cookieId: { type: String, required: true, unique: true },
  userId:   { type: Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, expires: 604800, default: Date.now }, // 7 days
});

module.exports = mongoose.model('Session', sessionSchema);
