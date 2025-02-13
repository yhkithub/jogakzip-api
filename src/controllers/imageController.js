// src/controllers/imageController.js
const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');

// AWS S3 설정
aws.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,       // 환경 변수에 설정
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,   // 환경 변수에 설정
  region: process.env.AWS_REGION                    // 예: 'us-east-1'
});

const s3 = new aws.S3();

// Multer S3 저장소 설정
const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWS_BUCKET_NAME,  // 환경 변수에 버킷 이름 설정
    acl: 'public-read',                   // 공개 읽기 권한
    key: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      cb(null, uniqueSuffix + '-' + file.originalname);
    }
  })
}).single('image');  // 'image'는 폼 데이터의 필드 이름

exports.uploadImage = (req, res) => {
  upload(req, res, function (err) {
    if (err) {
      console.error("이미지 업로드 오류:", err);
      return res.status(500).json({ message: '이미지 업로드 실패', error: err.message });
    }
    if (!req.file) {
      return res.status(400).json({ message: '이미지가 업로드되지 않았습니다' });
    }
    // req.file.location에는 S3에서 제공하는 파일의 공개 URL이 들어 있습니다.
    res.status(200).json({ imageUrl: req.file.location });
  });
};

module.exports = {
  uploadImage,
};
