// src/routes/commentRoutes.js
const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');

/*
  댓글 수정 및 삭제는 "/api/comments/:commentId" 형태로 접근합니다.
  이 라우터는 별도로 "/api/comments" 경로에 마운트할 예정입니다.
*/
router.put('/:commentId', commentController.updateComment);
router.delete('/:commentId', commentController.deleteComment);

module.exports = router;

