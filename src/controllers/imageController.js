// src/controllers/imageController.js
const path = require('path');

exports.uploadImage = (req, res) => {
  try {
    // 테스트용으로 GitHub 저장소에 저장된 이미지의 raw URL을 반환합니다.
    // 예: https://raw.githubusercontent.com/{yourusername}/jogakzip-api/main/public/images/test.png
    const imageUrl = 'https://raw.githubusercontent.com/yhkithub/jogakzip-api/main/public/images/test.png';
    
    res.status(200).json({ imageUrl });
  } catch (error) {
    console.error("Image upload error:", error);
    res.status(500).json({ message: "Image upload error" });
  }
};
