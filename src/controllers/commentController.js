// src/controllers/commentController.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// 댓글 등록 (POST /api/posts/:postId/comments)
exports.createComment = async (req, res) => {
  try {
    const { postId } = req.params;
    const { nickname, content, password } = req.body;
    if (!postId || !nickname || !content) {
      return res.status(400).json({ message: "postId, nickname, and content are required." });
    }
    const comment = await prisma.comment.create({
      data: {
        postId: parseInt(postId),
        nickname,
        content,
        password: password || null,
      },
    });
    res.status(201).json(comment);
  } catch (error) {
    console.error("Error creating comment:", error);
    res.status(500).json({ message: "Error creating comment" });
  }
};

// 댓글 목록 조회 (GET /api/posts/:postId/comments)
exports.getCommentsByPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const currentPage = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 50; // 기본값 전체 댓글

    // 댓글 목록 조회
    const comments = await prisma.comment.findMany({
      where: { postId: parseInt(postId) }
    });

    // password 필드 제거하고 필요한 필드만 선택
    const formattedComments = comments.map(comment => ({
      id: comment.id,
      nickname: comment.nickname,
      content: comment.content,
      createdAt: comment.createdAt
    }));

    const totalItemCount = formattedComments.length;
    const totalPages = Math.ceil(totalItemCount / pageSize);
    const paginatedData = formattedComments.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    res.json({
      currentPage,
      totalPages,
      totalItemCount,
      data: paginatedData
    });
  } catch (error) {
    console.error("댓글 목록 조회 오류:", error);
    res.status(500).json({ message: "댓글 목록 조회 중 오류 발생" });
  }
};

// 댓글 수정 (PUT /api/comments/:commentId)
exports.updateComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { nickname, content, password } = req.body;
    const existingComment = await prisma.comment.findUnique({ where: { id: parseInt(commentId) } });
    if (!existingComment) return res.status(404).json({ message: "Comment not found" });
    const updatedComment = await prisma.comment.update({
      where: { id: parseInt(commentId) },
      data: { nickname, content, password },
    });
    res.json(updatedComment);
  } catch (error) {
    console.error("Error updating comment:", error);
    res.status(500).json({ message: "Error updating comment" });
  }
};

// 댓글 삭제 (DELETE /api/comments/:commentId)
exports.deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const existingComment = await prisma.comment.findUnique({ where: { id: parseInt(commentId) } });
    if (!existingComment) return res.status(404).json({ message: "Comment not found" });
    await prisma.comment.delete({ where: { id: parseInt(commentId) } });
    res.json({ message: "Comment deleted" });
  } catch (error) {
    console.error("Error deleting comment:", error);
    res.status(500).json({ message: "Error deleting comment" });
  }
};
