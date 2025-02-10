
const express = require('express');
const router = express.Router();
const { calculateUserBadges } = require('../services/badgeService');

router.get('/users/:userId/badges', async (req, res) => {
  const { userId } = req.params;
  const badges = await calculateUserBadges(userId);
  res.json(badges);
});

module.exports = router;
