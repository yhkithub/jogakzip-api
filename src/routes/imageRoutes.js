
const express = require('express');
const router = express.Router();
const { uploadImage, handleUploadedImage } = require('../controllers/imageController');

router.post('/', uploadImage, handleUploadedImage);

module.exports = router;
