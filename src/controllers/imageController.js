// src/controllers/imageController.js
const path = require('path');

exports.uploadImage = (req, res) => {
  try {
    // 파일이 없으면 기본 이미지 URL 반환
    if (!req.file) {
      // GitHub에 업로드한 샘플 이미지의 raw URL 예시입니다.
      const defaultImageUrl = 'https://raw.githubusercontent.com/yourusername/jogakzip-api/main/public/images/test.png';
      return res.status(200).json({ imageUrl: defaultImageUrl });
    }
    // 실제 업로드된 경우 (예를 들어 AWS S3를 사용했다면 req.file.location 등을 사용)
    // 여기서는 테스트로 고정 URL을 반환합니다.
    const imageUrl = 'https://raw.githubusercontent.com/yourusername/jogakzip-api/main/public/images/test.png';
    res.status(200).json({ imageUrl });
  } catch (error) {
    console.error("Image upload error:", error);
    res.status(500).json({ message: "Image upload error" });
  }
};