// src/controllers/imageController.js
const multer = require('multer');

// 메모리 저장소 사용: 파일이 req.file.buffer에 저장됨
const storage = multer.memoryStorage();
const upload = multer({ storage });

exports.uploadImage = (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    // 여기서 실제 파일 업로드 처리는 외부 스토리지(S3, Cloudinary 등)를 사용하여 업로드할 수 있습니다.
    // 예시로 고정 URL 반환 (실제 운영에서는 업로드 후 URL 반환)
    const imageUrl = `https://your-cdn.com/${req.file.originalname}`;
    res.status(200).json({ imageUrl });
  } catch (error) {
    console.error("Image upload error:", error);
    res.status(500).json({ message: "Image upload error" });
  }
};

// export upload if needed in routes
exports.upload = upload;
