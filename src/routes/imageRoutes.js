// src/routes/imageRoutes.js
const express = require('express');
const router = express.Router();
const imageController = require('../controllers/imageController');

// 여기서는 imageController.upload (memory storage)를 사용합니다.
router.post('/', imageController.upload.single('image'), imageController.uploadImage);

module.exports = router;
