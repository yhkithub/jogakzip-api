// src/controllers/postController.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * 게시물 등록 (POST /api/groups/{groupId}/posts)
 */
exports.createPost = async (req, res) => {
  try {
    // URL에서 groupId를 가져옵니다.
    const { groupId } = req.params;
    // 요청 본문에서 API 명세에 따라 필요한 값을 추출합니다.
    // API 명세에 따라 요청 본문은 postPassword와 groupPassword를 포함합니다.
    const { 
      nickname, 
      title, 
      content, 
      postPassword,   // 게시글 비밀번호 (실제 Post 모델의 password 필드로 저장)
      groupPassword,  // (추후 그룹 비밀번호 검증에 사용할 수 있음)
      imageUrl, 
      tags,           // 배열 형태가 올 것으로 예상됨
      location, 
      moment, 
      isPublic 
    } = req.body;
    
    // 필수 값 검증
    if (!groupId || !title || !content) {
      return res.status(400).json({ message: 'groupId, title, content는 필수입니다.' });
    }
    
    // tags가 배열이면 콤마로 구분된 문자열로 변환
    const tagsString = Array.isArray(tags) ? tags.join(',') : tags;
    
    // (추후 그룹 비밀번호 검증 로직을 추가할 수 있음)

    const newPost = await prisma.post.create({
      data: {
        groupId: parseInt(groupId),
        nickname: nickname || '익명',
        title,
        content,
        imageUrl: imageUrl || null,
        tags: tagsString || null,
        location: location || null,
        moment: moment ? new Date(moment) : null,
        isPublic: isPublic !== undefined ? isPublic : true,
        password: postPassword || null  // postPassword를 저장
      }
    });
    
    // 생성된 게시물 객체를 반환 (HTTP 상태 코드는 201 Created 권장)
    res.status(201).json(newPost);
  } catch (error) {
    console.error("게시물 생성 오류:", error);
    res.status(500).json({ message: '게시물 등록 중 오류 발생' });
  }
};  

/**
 * 게시물 목록 조회 (GET /api/groups/{groupId}/posts)
 */
exports.getPostsByGroup = async (req, res) => {
  try {
    const { groupId } = req.params;
    const posts = await prisma.post.findMany({
      where: { groupId: parseInt(groupId) },
      include: { comments: true }
    });
    
    // 단순 페이징 정보 예시 (실제 페이징 로직 필요 시 수정)
    const currentPage = 1;
    const totalItemCount = posts.length;
    const totalPages = 1; // 예시로 1페이지라고 가정
    
    res.json({
      currentPage,
      totalPages,
      totalItemCount,
      data: posts
    });
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ message: "Error fetching posts" });
  }
};

/**
 * 게시물 상세 조회 (GET /api/posts/{postId})
 */
exports.getPostById = async (req, res) => {
  try {
    const { postId } = req.params;
    const post = await prisma.post.findUnique({
      where: { id: parseInt(postId) },
      include: { comments: true }
    });
    if (!post) return res.status(404).json({ message: '게시물을 찾을 수 없습니다.' });
    res.json(post);
  } catch (error) {
    console.error("게시물 상세 조회 오류:", error);
    res.status(500).json({ message: '게시물 상세 조회 중 오류 발생' });
  }
};

/**
 * 게시물 수정 (PUT /api/posts/{postId})
 */
exports.updatePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { title, content, imageUrl, tags, location, isPublic, password } = req.body;

    // 게시물 존재 여부 확인
    const existingPost = await prisma.post.findUnique({ where: { id: parseInt(postId) } });
    if (!existingPost) return res.status(404).json({ message: '게시물이 존재하지 않습니다.' });
    
    // tags가 배열이면 콤마로 구분된 문자열로 변환
    const tagsString = Array.isArray(tags) ? tags.join(',') : tags;
    
    const updatedPost = await prisma.post.update({
      where: { id: parseInt(postId) },
      data: { 
        title, 
        content, 
        imageUrl, 
        tags: tagsString, 
        location, 
        isPublic, 
        password 
      }
    });

    res.json(updatedPost);
  } catch (error) {
    console.error("게시물 수정 오류:", error);
    res.status(500).json({ message: '게시물 수정 중 오류 발생' });
  }
};

/**
 * 게시물 삭제 (DELETE /api/posts/{postId})
 */
exports.deletePost = async (req, res) => {
  try {
    const { postId } = req.params;
    // 존재 여부 확인
    const existingPost = await prisma.post.findUnique({ where: { id: parseInt(postId) } });
    if (!existingPost) return res.status(404).json({ message: '게시물이 존재하지 않습니다.' });

    await prisma.post.delete({ where: { id: parseInt(postId) } });
    res.json({ message: '게시물이 삭제되었습니다.' });
  } catch (error) {
    console.error("게시물 삭제 오류:", error);
    res.status(500).json({ message: '게시물 삭제 중 오류 발생' });
  }
};

/**
 * 게시물 조회 권한 확인 (POST /api/posts/{postId}/verify-password)
 */
exports.verifyPostPassword = async (req, res) => {
  try {
    const { postId } = req.params;
    const { password } = req.body;
    const post = await prisma.post.findUnique({ where: { id: parseInt(postId) } });
    if (!post) return res.status(404).json({ message: '게시물이 존재하지 않습니다.' });

    // 비밀번호 비교 (단순 문자열 비교; 실제 서비스에서는 암호화 필요)
    if (post.password !== password) return res.status(401).json({ message: '비밀번호가 틀렸습니다.' });

    res.json({ message: '비밀번호 확인되었습니다.' });
  } catch (error) {
    console.error("비밀번호 확인 오류:", error);
    res.status(500).json({ message: '비밀번호 확인 중 오류 발생' });
  }
};

/**
 * 게시물 공감하기 (POST /api/posts/{postId}/like)
 */
exports.likePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const post = await prisma.post.findUnique({ where: { id: parseInt(postId) } });
    if (!post) return res.status(404).json({ message: '게시물이 존재하지 않습니다.' });

    const updatedPost = await prisma.post.update({
      where: { id: parseInt(postId) },
      data: { likeCount: post.likeCount + 1 }
    });
    res.json({ message: '게시물 공감 완료', likeCount: updatedPost.likeCount });
  } catch (error) {
    console.error("게시물 공감 오류:", error);
    res.status(500).json({ message: '게시물 공감 중 오류 발생' });
  }
};

/**
 * 게시물 공개 여부 확인 (GET /api/posts/{postId}/is-public)
 */
exports.isPublicPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const post = await prisma.post.findUnique({ where: { id: parseInt(postId) } });
    if (!post) return res.status(404).json({ message: '게시물이 존재하지 않습니다.' });
    res.json({ id: post.id, isPublic: post.isPublic });
  } catch (error) {
    console.error("게시물 공개 여부 확인 오류:", error);
    res.status(500).json({ message: '게시물 공개 여부 확인 중 오류 발생' });
  }
};
