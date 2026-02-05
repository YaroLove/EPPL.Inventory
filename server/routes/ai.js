const express = require('express');
const aiController = require('../controllers/aiController');

const router = express.Router();

router.post('/ask', aiController.ask, (req, res) => {
    res.status(200).json({ answer: res.locals.answer });
});

module.exports = router;
