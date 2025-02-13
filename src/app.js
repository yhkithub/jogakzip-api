// src/app.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

// 각 라우터 모듈 (아래에서 생성할 예정)
const groupRoutes = require('./routes/groupRoutes');
const postRoutes = require('./routes/postRoutes');
const commentRoutes = require('./routes/commentRoutes');
const postCommentRoutes = require('./routes/postCommentRoutes');
const imageRoutes = require('./routes/imageRoutes');
// badgeRoutes 등 추가 가능

// 미들웨어 설정
app.use(cors());
app.use(express.json());

// 기본 엔드포인트
app.get('/', (req, res) => {
  res.send('조각집 백엔드 API 서버입니다!');
});

// 라우터 등록
app.use('/groups', groupRoutes);
app.use('/', postRoutes);
app.use('/posts', postRoutes);
app.use('/comments', commentRoutes);
app.use('/posts', postCommentRoutes);
app.use('/image', imageRoutes);


// 서버 실행
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;