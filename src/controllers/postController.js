// src/controllers/postController.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');
const SALT_ROUNDS = 10;

/**
 * 게시물 등록 (POST /api/groups/{groupId}/posts)
 */
exports.createPost = async (req, res) => {
  try {
    const { groupId } = req.params;
    let { nickname, title, content, postPassword, groupPassword, imageUrl, tags, location, moment, isPublic } = req.body;
    
    if (!groupId || !title || !content) {
      return res.status(400).json({ message: 'groupId, title, content는 필수입니다.' });
    }
    
    // 이미지 URL이 제공되지 않았다면 기본 이미지 URL 사용
    if (!imageUrl) {
      imageUrl = 'https://raw.githubusercontent.com/yhkithub/jogakzip-api/main/public/images/test.png';
    }
    
    // tags가 배열이면 콤마로 구분된 문자열로 변환
    const tagsString = Array.isArray(tags) ? tags.join(',') : tags;
    
    const newPost = await prisma.post.create({
      data: {
        groupId: parseInt(groupId),
        nickname: nickname || '익명',
        title,
        content,
        imageUrl: imageUrl,
        tags: tagsString || null,
        location: location || null,
        moment: moment ? new Date(moment) : null,
        isPublic: isPublic !== undefined ? isPublic : true,
        password: postPassword || null  
      }
    });
    
    // 게시물이 생성되면 해당 그룹의 postCount를 1 증가시킵니다.
    await prisma.group.update({
      where: { id: parseInt(groupId) },
      data: { postCount: { increment: 1 } }
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
    const currentPage = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 50; // 기본값: 전체 항목

    const posts = await prisma.post.findMany({
      where: { groupId: parseInt(groupId) }
    });
    
    const formattedPosts = await Promise.all(posts.map(async post => {
      // tags가 문자열인 경우 배열로 변환
      const formattedTags = typeof post.tags === 'string'
        ? post.tags.split(',').map(tag => tag.trim()).filter(tag => tag !== "")
        : (post.tags || []);
      
      // moment 값 처리: post.moment가 존재하면 유효한 날짜인지 체크
      let formattedMoment = null;
      if (post.moment) {
        const d = new Date(post.moment);
        formattedMoment = isNaN(d.getTime()) ? null : d.toISOString();
      }
      
      // 실제 댓글 수를 계산 (필요하다면)
      const commentCount = await prisma.comment.count({
        where: { postId: post.id }
      });
      
      return {
        id: post.id,
        nickname: post.nickname,
        title: post.title,
        imageUrl: post.imageUrl,
        tags: formattedTags,
        location: post.location,
        moment: formattedMoment,
        isPublic: post.isPublic,
        likeCount: post.likeCount,
        commentCount: commentCount,
        createdAt: post.createdAt
      };
    }));
    
    const totalItemCount = formattedPosts.length;
    const totalPages = Math.ceil(totalItemCount / pageSize);
    const paginatedData = formattedPosts.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    res.json({
      currentPage,
      totalPages,
      totalItemCount,
      data: paginatedData
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
    // 게시글 상세 조회 시 comments는 include하지 않고, password도 노출하지 않음.
    const post = await prisma.post.findUnique({
      where: { id: parseInt(postId) },
      // comments 포함하지 않음; 필요하다면 commentCount는 별도로 계산
    });
    if (!post) {
      return res.status(404).json({ message: '게시물을 찾을 수 없습니다.' });
    }
    
    // tags 필드: 문자열인 경우 배열로 변환, 아니면 빈 배열 처리
    const formattedTags = typeof post.tags === 'string'
      ? post.tags.split(',').map(tag => tag.trim()).filter(tag => tag !== "")
      : (post.tags || []);
    
    // moment 필드: 존재하면 유효한 날짜인지 확인하고 ISO 문자열로 변환, 아니면 null
    let formattedMoment = null;
    if (post.moment) {
      const d = new Date(post.moment);
      formattedMoment = isNaN(d.getTime()) ? null : d.toISOString();
    }
    
    // 만약 commentCount가 별도로 계산되어야 한다면, (예: 현재 저장된 값이 부정확하다면)
    // const commentCount = await prisma.comment.count({ where: { postId: post.id } });
    // 여기서는 post.commentCount를 그대로 사용한다고 가정
    
    // API 명세 예시에 맞게 password와 comments 필드는 제거합니다.
    const formattedPost = {
      id: post.id,
      groupId: post.groupId,
      nickname: post.nickname,
      title: post.title,
      content: post.content,
      imageUrl: post.imageUrl,
      tags: formattedTags,
      location: post.location,
      moment: formattedMoment,
      isPublic: post.isPublic,
      likeCount: post.likeCount,
      commentCount: post.commentCount, // 또는 위에서 계산한 commentCount
      createdAt: post.createdAt
    };

    // 응답을 순수 JSON 객체로 직렬화해서 반환
    res.json(JSON.parse(JSON.stringify(formattedPost)));
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
    
    // 게시글이 존재하는지 확인
    const existingPost = await prisma.post.findUnique({
      where: { id: parseInt(postId) }
    });
    if (!existingPost) {
      return res.status(404).json({ message: '게시물이 존재하지 않습니다.' });
    }

    const groupId = existingPost.groupId;

    // 해당 게시글에 달린 댓글들을 먼저 삭제
    await prisma.comment.deleteMany({
      where: { postId: parseInt(postId) }
    });

    // 게시글 삭제
    await prisma.post.delete({
      where: { id: parseInt(postId) }
    });

    // 그룹의 postCount를 1 감소시킵니다.
    await prisma.group.update({
      where: { id: parseInt(groupId) },
      data: { postCount: { decrement: 1 } }
    });

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

    // bcrypt.compare를 사용하여 입력된 비밀번호와 저장된 해시 비교
    const match = await bcrypt.compare(password, post.password || '');
    if (!match) return res.status(401).json({ message: '비밀번호가 틀렸습니다.' });

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
