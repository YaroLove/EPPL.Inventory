const express = require('express');
const ActionLog = require('../models/actionLogModel');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const logs = await ActionLog.find()
      .sort({ timestamp: -1 })
      .limit(200);
    res.status(200).json(logs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
