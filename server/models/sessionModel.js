const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/** Session cookie TTL: 7 days of inactivity (sliding — see requireAuth lastAccessAt bump). */
const SESSION_TTL_SECONDS = 7 * 24 * 60 * 60; // 604800

const sessionSchema = new Schema({
  cookieId: { type: String, required: true, unique: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
  /** Bumped on each authenticated request; MongoDB TTL deletes doc after this + 7d. */
  lastAccessAt: { type: Date, default: Date.now },
});

sessionSchema.index({ lastAccessAt: 1 }, { expireAfterSeconds: SESSION_TTL_SECONDS });

module.exports = mongoose.model('Session', sessionSchema);
