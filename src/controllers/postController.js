// src/controllers/postController.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * 게시물 등록 (POST /api/groups/{groupId}/posts)
 */
exports.createPost = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { nickname, title, content, imageUrl, tags, location, moment, isPublic, password } = req.body;

    // 필수 값 검증: groupId, title, content 등
    if (!groupId || !title || !content) {
      return res.status(400).json({ message: 'groupId, title, content는 필수입니다.' });
    }

    // 게시물 생성
    const newPost = await prisma.post.create({
      data: {
        groupId: parseInt(groupId),
        nickname: nickname || '익명',
        title,
        content,
        imageUrl: imageUrl || null,
        tags: tags || null,
        location: location || null,
        moment: moment ? new Date(moment) : null,
        isPublic: isPublic !== undefined ? isPublic : true,
        password: password || null
      }
    });

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
    res.json(posts);
  } catch (error) {
    console.error("게시물 목록 조회 오류:", error);
    res.status(500).json({ message: '게시물 목록 조회 중 오류 발생' });
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

    const updatedPost = await prisma.post.update({
      where: { id: parseInt(postId) },
      data: { title, content, imageUrl, tags, location, isPublic, password }
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
