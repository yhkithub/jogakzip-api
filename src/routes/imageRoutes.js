// src/routes/imageRoutes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');

// 메모리 저장소를 사용하므로, 파일은 req.file.buffer에 저장됩니다.
const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).single('image'); // 'image'는 폼 데이터의 필드 이름

const imageController = require('../controllers/imageController');

// POST /api/image - multer 미들웨어와 함께 이미지 업로드 핸들러를 호출합니다.
router.post('/', upload, imageController.uploadImage);

module.exports = router;