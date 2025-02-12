// 예시: src/routes/postCommentRoutes.js (새 파일로 분리)
const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');

/* 
  댓글 등록 및 목록 조회는 게시물 관련 엔드포인트로 사용합니다.
  이 부분은 "/api/posts/:postId/comments" 형태로 접근합니다.
*/
router.post('/:postId/comments', commentController.createComment);
router.get('/:postId/comments', commentController.getCommentsByPost);

module.exports = router;
