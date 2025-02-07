// src/controllers/postController.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.createPost = async (req, res) => {
  try {
    const { groupId, title, content, image, tags, location } = req.body;
    const post = await prisma.post.create({
      data: { groupId, title, content, image, tags, location },
    });
    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllPosts = async (req, res) => {
  try {
    const { groupId } = req.query;
    let posts;
    if (groupId) {
      posts = await prisma.post.findMany({
        where: { groupId },
        include: { comments: true },
      });
    } else {
      posts = await prisma.post.findMany({
        include: { comments: true },
      });
    }
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getPostById = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await prisma.post.findUnique({
      where: { id },
      include: { comments: true },
    });
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, image, tags, location } = req.body;
    const post = await prisma.post.update({
      where: { id },
      data: { title, content, image, tags, location },
    });
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.post.delete({
      where: { id },
    });
    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
