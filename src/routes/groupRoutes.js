// src/routes/groupRoutes.js
const express = require('express');
const router = express.Router();

// 예시 엔드포인트: 그룹 목록 조회 (GET /api/groups)
router.get('/', (req, res) => {
  res.send('Group routes are working.');
});

module.exports = router;
