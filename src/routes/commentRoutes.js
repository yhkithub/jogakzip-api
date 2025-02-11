// src/routes/commentRoutes.js
const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');

/* 
  댓글 등록 및 목록 조회는 게시물 관련 엔드포인트로 사용합니다.
  이 부분은 "/api/posts/:postId/comments" 형태로 접근합니다.
*/
router.post('/posts/:postId/comments', commentController.createComment);
router.get('/posts/:postId/comments', commentController.getCommentsByPost);

/*
  댓글 수정 및 삭제는 "/api/comments/:commentId" 형태로 접근합니다.
  이 라우터는 별도로 "/api/comments" 경로에 마운트할 예정입니다.
*/
router.put('/:commentId', commentController.updateComment);
router.delete('/:commentId', commentController.deleteComment);

module.exports = router;
