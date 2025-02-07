// src/controllers/groupController.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.createGroup = async (req, res) => {
  try {
    const { name, image, description, isPublic, password } = req.body;
    const group = await prisma.group.create({
      data: { name, image, description, isPublic, password },
    });
    res.status(201).json(group);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllGroups = async (req, res) => {
  try {
    const groups = await prisma.group.findMany({
      include: { posts: true },
    });
    res.status(200).json(groups);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getGroupById = async (req, res) => {
  try {
    const { id } = req.params;
    const group = await prisma.group.findUnique({
      where: { id },
      include: { posts: true },
    });
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }
    res.status(200).json(group);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateGroup = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, image, description, isPublic, password } = req.body;
    const group = await prisma.group.update({
      where: { id },
      data: { name, image, description, isPublic, password },
    });
    res.status(200).json(group);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteGroup = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.group.delete({
      where: { id },
    });
    res.status(200).json({ message: 'Group deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
