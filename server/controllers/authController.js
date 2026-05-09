const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const User = require('../models/userModel');
const Session = require('../models/sessionModel');

const COOKIE_MAX_AGE = 7 * 24 * 60 * 60 * 1000; // 7 days in ms

function userPayload(user) {
  return {
    email: user.email,
    displayName: user.displayName || user.email,
    role: user.role,
    tempPassword: user.tempPassword,
    settings: user.settings,
    favorites: user.favorites,
  };
}

const authController = {};

authController.login = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next({ code: 400, error: 'Email and password are required' });
  }
  try {
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) return next({ code: 401, error: 'Invalid email or password' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return next({ code: 401, error: 'Invalid email or password' });

    const cookieId = crypto.randomUUID();
    const now = new Date();
    await Session.create({ cookieId, userId: user._id, lastAccessAt: now, createdAt: now });

    res.cookie('ssid', cookieId, {
      maxAge: COOKIE_MAX_AGE,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });

    res.status(200).json(userPayload(user));
  } catch (err) {
    next({ code: 500, error: err });
  }
};

authController.logout = async (req, res) => {
  try {
    const cookieId = req.cookies?.ssid;
    if (cookieId) await Session.deleteOne({ cookieId });
    res.clearCookie('ssid');
    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Logout failed' });
  }
};

authController.me = async (req, res) => {
  try {
    const cookieId = req.cookies?.ssid;
    if (!cookieId) return res.status(401).json({ error: 'Not authenticated' });

    const session = await Session.findOneAndUpdate(
      { cookieId },
      { $set: { lastAccessAt: new Date() } },
      { new: true }
    );
    if (!session) return res.status(401).json({ error: 'Session expired' });

    const user = await User.findById(session.userId);
    if (!user) return res.status(401).json({ error: 'User not found' });

    res.status(200).json(userPayload(user));
  } catch (err) {
    res.status(500).json({ error: 'Auth check failed' });
  }
};

module.exports = authController;
