
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({ storage });

exports.uploadImage = upload.single('image');

exports.handleUploadedImage = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: '이미지가 없습니다.' });
  }
  res.json({ url: `/uploads/${req.file.filename}` });
};
