// src/controllers/groupController.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// 그룹 등록 (POST /api/groups)
exports.createGroup = async (req, res) => {
  try {
    const { name, password, imageUrl, isPublic, introduction } = req.body;
    // 요청 검증 (생략 가능)
    const createdGroup = await prisma.group.create({
      data: { name, password, imageUrl, isPublic, introduction },
    });
    
    // 응답 객체 재구성: API 명세에 맞게 민감 정보 제외, badges 필드는 빈 배열로 설정
    const responsePayload = {
      id: createdGroup.id,
      name: createdGroup.name,
      introduction: createdGroup.introduction,
      imageUrl: createdGroup.imageUrl,
      isPublic: createdGroup.isPublic,
      likeCount: createdGroup.likeCount,
      postCount: createdGroup.postCount,
      badges: [],  // 만약 그룹에 연결된 badge 정보가 있다면 해당 값을 넣고, 없으면 빈 배열로 반환
      createdAt: createdGroup.createdAt,
    };

    res.status(201).json(responsePayload);
  } catch (error) {
    console.error("Error creating group:", error);
    res.status(500).json({ message: "잘못된 요청입니다" });
  }
};

// 그룹 목록 조회 (GET /api/groups)
exports.getGroups = async (req, res) => {
  try {
    const groups = await prisma.group.findMany();
    res.json(groups);
  } catch (error) {
    console.error("Error fetching groups:", error);
    res.status(500).json({ message: "Error fetching groups" });
  }
};

// 그룹 상세 조회 (GET /api/groups/:groupId)
exports.getGroupById = async (req, res) => {
  try {
    const { groupId } = req.params;
    const group = await prisma.group.findUnique({
      where: { id: parseInt(groupId) },
    });
    if (!group) return res.status(404).json({ message: "Group not found" });
    res.json(group);
  } catch (error) {
    console.error("Error fetching group:", error);
    res.status(500).json({ message: "Error fetching group" });
  }
};

// 그룹 수정 (PUT /api/groups/:groupId)
exports.updateGroup = async (req, res) => {
  try {
    const { groupId } = req.params;
    const data = req.body;
    const updatedGroup = await prisma.group.update({
      where: { id: parseInt(groupId) },
      data,
    });
    res.json(updatedGroup);
  } catch (error) {
    console.error("Error updating group:", error);
    res.status(500).json({ message: "Error updating group" });
  }
};

// 그룹 삭제 (DELETE /api/groups/:groupId)
exports.deleteGroup = async (req, res) => {
  try {
    const { groupId } = req.params;
    await prisma.group.delete({
      where: { id: parseInt(groupId) },
    });
    res.json({ message: "Group deleted" });
  } catch (error) {
    console.error("Error deleting group:", error);
    res.status(500).json({ message: "Error deleting group" });
  }
};

// 그룹 조회 권한 확인 (POST /api/groups/:groupId/verify-password)
exports.verifyGroupPassword = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { password } = req.body;
    const group = await prisma.group.findUnique({
      where: { id: parseInt(groupId) },
    });
    if (!group) return res.status(404).json({ message: "Group not found" });
    if (group.password !== password) {
      return res.status(401).json({ message: "Incorrect password" });
    }
    res.json({ message: "Password verified" });
  } catch (error) {
    console.error("Error verifying group password:", error);
    res.status(500).json({ message: "Error verifying group password" });
  }
};

// 그룹 공감하기 (POST /api/groups/:groupId/like)
exports.likeGroup = async (req, res) => {
  try {
    const { groupId } = req.params;
    const group = await prisma.group.findUnique({
      where: { id: parseInt(groupId) },
    });
    if (!group) return res.status(404).json({ message: "Group not found" });
    const updatedGroup = await prisma.group.update({
      where: { id: parseInt(groupId) },
      data: { likeCount: group.likeCount + 1 },
    });
    res.json({ message: "Group liked", likeCount: updatedGroup.likeCount });
  } catch (error) {
    console.error("Error liking group:", error);
    res.status(500).json({ message: "Error liking group" });
  }
};

// 그룹 공개 여부 확인 (GET /api/groups/:groupId/is-public)
exports.isPublicGroup = async (req, res) => {
  try {
    const { groupId } = req.params;
    const group = await prisma.group.findUnique({
      where: { id: parseInt(groupId) },
    });
    if (!group) return res.status(404).json({ message: "Group not found" });
    res.json({ id: group.id, isPublic: group.isPublic });
  } catch (error) {
    console.error("Error checking group's public status:", error);
    res.status(500).json({ message: "Error checking group's public status" });
  }
};
