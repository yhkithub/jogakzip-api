// src/routes/postRoutes.js
const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');

// 그룹 내 게시물 등록: POST /api/groups/:groupId/posts
router.post('/groups/:groupId/posts', postController.createPost);

// 그룹 내 게시물 목록 조회: GET /api/groups/:groupId/posts
router.get('/groups/:groupId/posts', postController.getPostsByGroup);

// 게시물 상세 조회: GET /api/posts/:postId
router.get('/:postId', postController.getPostById);

// 게시물 수정: PUT /api/posts/:postId
router.put('/:postId', postController.updatePost);

// 게시물 삭제: DELETE /api/posts/:postId
router.delete('/:postId', postController.deletePost);

// 게시물 조회 권한 확인: POST /api/posts/:postId/verify-password
router.post('/:postId/verify-password', postController.verifyPostPassword);

// 게시물 공감하기: POST /api/posts/:postId/like
router.post('/:postId/like', postController.likePost);

// 게시물 공개 여부 확인: GET /api/posts/:postId/is-public
router.get('/:postId/is-public', postController.isPublicPost);

module.exports = router;
