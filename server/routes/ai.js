const express = require('express');
const aiController = require('../controllers/aiController');

const router = express.Router();

router.post('/ask', aiController.ask, (req, res) => {
  res.status(200).json({ answer: res.locals.answer });
});

router.get('/suggestions', aiController.suggestions, (req, res) => {
  res.status(200).json({ suggestions: res.locals.suggestions });
});

module.exports = router;
