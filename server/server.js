const path = require('path');
const express = require('express');
const cookieParser = require('cookie-parser');
require('dotenv').config();

console.log('Starting server...');

const app = express();
const port = process.env.PORT || 3000;

console.log('Loading routes...');
const itemsRouter = require('./routes/items');
const userController = require('./controllers/userController');
const cookieController = require('./controllers/cookieController');
const sessionController = require('./controllers/sessionController');
console.log('Routes loaded successfully');

const mongoose = require('mongoose');
require('./models/itemsModels');
const { seedFieldDefinitionsIfEmpty } = require('./utils/seedFieldDefinitions');
const { seedAdmin } = require('./utils/seedAdmin');
const requireAuth = require('./middleware/requireAuth');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ── Public routes (no auth required) ─────────────────────────────────────────
app.use('/auth', require('./routes/auth'));

// ── Protected routes ──────────────────────────────────────────────────────────
app.use('/items',            requireAuth, itemsRouter);
app.use('/categories',       requireAuth, require('./routes/categories'));
app.use('/suppliers',        requireAuth, require('./routes/suppliers'));
app.use('/field-definitions',requireAuth, require('./routes/fieldDefinitions'));
app.use('/shopping',         requireAuth, require('./routes/shoppingList'));
app.use('/ai',               requireAuth, require('./routes/ai'));
app.use('/user',             requireAuth, require('./routes/userRoutes'));
app.use('/admin',            requireAuth, require('./routes/admin'));
app.use('/history',          requireAuth, require('./routes/history'));

// ── File uploads (protected) ──────────────────────────────────────────────────
app.use('/upload',   requireAuth, require('./routes/upload'));
app.use('/uploads',  express.static(path.join(__dirname, 'uploads')));

// ── Legacy signup (kept for compatibility) ────────────────────────────────────
app.post(
  '/signup',
  userController.createUser,
  cookieController.setSSIDCookie,
  sessionController.startSession,
  (req, res) => {}
);

// ── Production: serve React build ─────────────────────────────────────────────
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../build')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../build', 'index.html'));
  });
}

// ── 404 ───────────────────────────────────────────────────────────────────────
app.use((req, res) =>
  res.status(404).send("404! This is not the page you're looking for...")
);

// ── Global error handler ──────────────────────────────────────────────────────
app.use(({ code, error }, req, res, next) => {
  const status = code && code >= 400 && code < 600 ? code : 500;
  res.status(status).json({ error: error?.message || error });
});

// ── DB-dependent startup tasks ────────────────────────────────────────────────
function runWhenDbReady(fn) {
  if (mongoose.connection.readyState === 1) {
    fn();
  } else {
    mongoose.connection.once('open', fn);
  }
}

runWhenDbReady(async () => {
  await seedFieldDefinitionsIfEmpty();
  await seedAdmin();
});

app.listen(port, () => console.log(`Listening on port ${port}`));
