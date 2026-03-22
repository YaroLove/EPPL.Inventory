const Session = require('../models/sessionModel');
const User = require('../models/userModel');

const requireAuth = async (req, res, next) => {
  const cookieId = req.cookies?.ssid;
  if (!cookieId) return res.status(401).json({ error: 'Not authenticated' });

  try {
    const session = await Session.findOne({ cookieId });
    if (!session) return res.status(401).json({ error: 'Session expired' });

    const user = await User.findById(session.userId);
    if (!user) return res.status(401).json({ error: 'User not found' });

    req.user = user;
    next();
  } catch (err) {
    res.status(500).json({ error: 'Auth error' });
  }
};

module.exports = requireAuth;
