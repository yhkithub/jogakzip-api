// src/controllers/imageController.js
const path = require('path');

exports.uploadImage = (req, res) => {
  try {
    // 업로드된 파일이 있는지 확인 (테스트용이라면 실제 파일 업로드는 무시)
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    // GitHub에 미리 업로드한 테스트 이미지의 raw URL을 반환합니다.
    // 아래 URL에서 "yourusername"과 "main"은 실제 GitHub 저장소 정보로 변경하세요.
    const imageUrl = 'https://raw.githubusercontent.com/yourusername/jogakzip-api/main/public/images/test.png';
    res.status(200).json({ imageUrl });
  } catch (error) {
    console.error("Image upload error:", error);
    res.status(500).json({ message: "Image upload error" });
  }
};
