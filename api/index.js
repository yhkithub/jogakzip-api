// api/index.js
const express = require('express');
const serverless = require('serverless-http');
const app = express();

// JSON 요청 바디 파싱
app.use(express.json());

/* --------------------------
   예제 엔드포인트 작성
   아래 예제는 "게시글 API"의 일부 예시입니다.
   실제 프로젝트 요구사항에 맞게 추가 및 수정하세요.
-------------------------- */

// 1) 게시글 등록 (예시)
app.post('/api/groups/:groupId/posts', (req, res) => {
  const { groupId } = req.params;
  const { nickname, title, content, password } = req.body;
  
  if (!nickname || !title || !password) {
    return res.status(400).json({ message: 'nickname, title, 그리고 password는 필수입니다.' });
  }
  
  // 실제로는 DB에 저장하는 로직을 추가합니다.
  const newPost = {
    id: Date.now(), // 예시용 ID (실제 서비스에서는 DB ID 사용)
    groupId,
    nickname,
    title,
    content: content || '',
    password,
    createdAt: new Date(),
  };
  
  // 임시 저장 (실제 서비스에서는 DB 사용)
  // 예시로 바로 응답 보내기
  res.status(201).json(newPost);
});

// 2) 게시글 상세 정보 조회 (예시)
app.get('/api/posts/:postId', (req, res) => {
  // 실제 DB 조회 로직 필요
  res.json({ message: `postId ${req.params.postId}에 해당하는 게시글 조회 예제` });
});

// 3) 그 외 다른 API 엔드포인트 추가…
app.get('/', (req, res) => {
  res.send("Hello, Zogakzip 백엔드 입니다!");
});

// --------------------------
// 로컬 실행을 위한 코드 (Vercel에서는 실행되지 않음)
// --------------------------
if (!process.env.VERCEL) {
  const port = process.env.PORT || 3000;
  app.listen(port, () => console.log(`Express 서버가 포트 ${port}에서 실행 중입니다.`));
}

// Vercel 서버리스 함수 핸들러로 변환
module.exports = app;
module.exports.handler = serverless(app);
