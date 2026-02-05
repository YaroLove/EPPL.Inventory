const path = require('path');
const express = require('express');
require('dotenv').config();

console.log('Starting server...');

const app = express();
const port = process.env.PORT || 3000;

console.log('Loading routes...');
console.log('Loading itemsRouter...');
const itemsRouter = require('./routes/items');
console.log('Loading userController...');
const userController = require('./controllers/userController');
console.log('Loading cookieController...');
const cookieController = require('./controllers/cookieController');
console.log('Loading sessionController...');
const sessionController = require('./controllers/sessionController');
console.log('Routes loaded successfully');

// app.use(express.static(path.resolve(__dirname, '../index.html')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Route to /items
app.use('/items', itemsRouter);
app.use('/shopping', require('./routes/shoppingList'));
app.use('/ai', require('./routes/ai'));
app.use('/upload', require('./routes/upload'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));



app.post(
  '/signup',
  userController.createUser,
  cookieController.setSSIDCookie,
  sessionController.startSession,
  (req, res) => {
    // what should happen here on successful sign up?
    // res.redirect('/');
    // console.log(res.locals.ssid);
    // res.status(200).json(res.locals.ssid);
  }
);

// Only serve build and static HTML in production mode
if (process.env.NODE_ENV === 'production') {
  app.use('/build', express.static(path.join(__dirname, '../build')));
  app.get('/', (req, res) => {
    return res.status(200).sendFile(path.join(__dirname, '../index.html'));
  });
}

// 404 Route Handler
app.use((req, res) =>
  res.status(404).send("404! This is not the page you're looking for...")
);

// Global Error Handler
app.use(({ code, error }, req, res, next) => {
  res.status(500).json({ error });
});

app.listen(port, () => console.log(`Listening on port ${port}`));
