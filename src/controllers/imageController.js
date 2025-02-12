// src/controllers/imageController.js
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // 임시 저장 경로 지정

exports.uploadImage = (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    const imageUrl = `https://your-cdn.com/${req.file.filename}`;
    res.status(200).json({ imageUrl });
  } catch (error) {
    console.error("Image upload error:", error);
    res.status(500).json({ message: "Image upload error" });
  }
};

