const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/userModel');
const requireAdmin = require('../middleware/requireAdmin');

const router = express.Router();

router.use(requireAdmin);

router.get('/users', async (req, res) => {
  try {
    const users = await User.find({}, 'email displayName role tempPassword createdAt');
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/users', async (req, res) => {
  const { email, displayName, tempPassword } = req.body;
  if (!email || !tempPassword) {
    return res.status(400).json({ error: 'Email and temporary password are required' });
  }
  try {
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) return res.status(409).json({ error: 'User with this email already exists' });

    const hash = await bcrypt.hash(tempPassword, 10);
    const user = await User.create({
      email: email.toLowerCase(),
      password: hash,
      displayName: displayName || email,
      role: 'user',
      tempPassword: true,
    });
    res.status(201).json({
      email: user.email,
      displayName: user.displayName,
      role: user.role,
      tempPassword: user.tempPassword,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/users/:id', async (req, res) => {
  try {
    if (req.user._id.toString() === req.params.id) {
      return res.status(400).json({ error: 'Cannot delete your own account' });
    }
    await User.findByIdAndDelete(req.params.id);
    res.sendStatus(200);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
