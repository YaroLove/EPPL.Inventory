const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/userModel');
const { Item } = require('../models/itemsModels');

const router = express.Router();

// ── Settings ──────────────────────────────────────────────────────────────────
router.get('/settings', async (req, res) => {
  res.status(200).json(req.user.settings);
});

router.put('/settings', async (req, res) => {
  try {
    const allowed = ['lowStockThreshold', 'expirationWarningDays', 'displayMode'];
    const update = {};
    allowed.forEach(k => {
      if (req.body[k] !== undefined) update[`settings.${k}`] = req.body[k];
    });
    const user = await User.findByIdAndUpdate(req.user._id, { $set: update }, { new: true });
    res.status(200).json(user.settings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Profile ───────────────────────────────────────────────────────────────────
router.put('/profile', async (req, res) => {
  const { displayName, email, currentPassword, newPassword } = req.body;
  try {
    const updates = {};
    if (displayName) updates.displayName = displayName.trim();
    if (email) updates.email = email.toLowerCase().trim();

    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({ error: 'Current password is required' });
      }
      const match = await bcrypt.compare(currentPassword, req.user.password);
      if (!match) return res.status(401).json({ error: 'Current password is incorrect' });
      updates.password = await bcrypt.hash(newPassword, 10);
      updates.tempPassword = false;
    }

    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true });
    res.status(200).json({
      email: user.email,
      displayName: user.displayName,
      role: user.role,
      tempPassword: user.tempPassword,
      settings: user.settings,
      favorites: user.favorites,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Favorites ─────────────────────────────────────────────────────────────────
router.get('/favorites', async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const items = await Item.find({ _id: { $in: user.favorites } });
    res.status(200).json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/favorites/:itemId', async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user._id, {
      $addToSet: { favorites: req.params.itemId },
    });
    res.sendStatus(200);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/favorites/:itemId', async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user._id, {
      $pull: { favorites: req.params.itemId },
    });
    res.sendStatus(200);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
