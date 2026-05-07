const fs = require('fs');
const path = require('path');
const Session = require('../models/sessionModel');
const User = require('../models/userModel');

// #region agent log
const AUTH_DBG_LOG = path.join(__dirname, '..', '..', '.cursor', 'debug-39af4b.log');
function authDebug(payload) {
  try {
    fs.appendFileSync(
      AUTH_DBG_LOG,
      `${JSON.stringify({ sessionId: '39af4b', runId: 'pre', timestamp: Date.now(), ...payload })}\n`
    );
  } catch (_) {}
}
// #endregion

const requireAuth = async (req, res, next) => {
  const cookieId = req.cookies?.ssid;
  const url = req.originalUrl || req.url;
  const logPath = `${req.method} ${url}`;

  if (!cookieId) {
    // #region agent log
    authDebug({
      hypothesisId: 'H5',
      location: 'requireAuth.js:no_cookie',
      message: 'auth_fail',
      data: { path: logPath },
    });
    // #endregion
    return res.status(401).json({ error: 'Not authenticated' });
  }

  try {
    const session = await Session.findOne({ cookieId });
    if (!session) {
      // #region agent log
      authDebug({
        hypothesisId: 'H1',
        location: 'requireAuth.js:no_session',
        message: 'auth_fail',
        data: { path: logPath, cookieIdPrefix: String(cookieId).slice(0, 8) },
      });
      // #endregion
      return res.status(401).json({ error: 'Session expired' });
    }

    const user = await User.findById(session.userId);
    if (!user) {
      // #region agent log
      authDebug({
        hypothesisId: 'H1',
        location: 'requireAuth.js:no_user',
        message: 'auth_fail',
        data: { path: logPath },
      });
      // #endregion
      return res.status(401).json({ error: 'User not found' });
    }

    req.user = user;
    if (
      (req.method === 'POST' && url.startsWith('/items')) ||
      (req.method === 'POST' && url.startsWith('/upload'))
    ) {
      // #region agent log
      authDebug({
        hypothesisId: 'H2',
        location: 'requireAuth.js:ok',
        message: 'auth_ok',
        data: { path: logPath, userId: String(user._id) },
      });
      // #endregion
    }
    next();
  } catch (err) {
    // #region agent log
    authDebug({
      hypothesisId: 'H1',
      location: 'requireAuth.js:catch',
      message: 'auth_error',
      data: { path: logPath, err: String(err?.message || err) },
    });
    // #endregion
    res.status(500).json({ error: 'Auth error' });
  }
};

module.exports = requireAuth;
