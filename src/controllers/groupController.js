// src/controllers/groupController.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// 그룹 등록 (POST /api/groups)
exports.createGroup = async (req, res) => {
  try {
    let { name, password, imageUrl, isPublic, introduction } = req.body;
    if (!name) {
      return res.status(400).json({ message: "Name is required." });
    }
    // 이미지 URL이 제공되지 않은 경우 기본 이미지 URL 할당
    if (!imageUrl) {
      imageUrl = 'https://raw.githubusercontent.com/yhkithub/jogakzip-api/main/public/images/test.png';
    }
    
    const createdGroup = await prisma.group.create({
      data: { name, password, imageUrl, isPublic, introduction },
    });
    
    const responsePayload = {
      id: createdGroup.id,
      name: createdGroup.name,
      introduction: createdGroup.introduction,
      imageUrl: createdGroup.imageUrl,
      isPublic: createdGroup.isPublic,
      likeCount: createdGroup.likeCount,
      postCount: createdGroup.postCount,
      badges: [],  
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

    // 각 그룹에 대해 게시물 수를 계산하여 응답 객체에 포함
    const groupsWithPostCount = await Promise.all(groups.map(async group => {
      const postCount = await prisma.post.count({
        where: { groupId: group.id }
      });
      return {
        ...group,
        postCount  // DB에 저장된 값 대신 계산된 값을 사용
      };
    }));

    // 예시로 단순 페이징 정보를 추가 (실제 페이징 로직이 필요하다면 수정)
    const currentPage = 1;
    const totalItemCount = groupsWithPostCount.length;
    const totalPages = 1; // 예시로 1페이지라고 가정

    res.json({
      currentPage,
      totalPages,
      totalItemCount,
      data: groupsWithPostCount
    });
  } catch (error) {
    console.error("Error fetching groups:", error);
    res.status(500).json({ message: "Error fetching groups" });
  }
};

// 그룹 상세 조회 (GET /api/groups/:groupId)
exports.getGroupById = async (req, res) => {
  try {
    const { groupId } = req.params;
    // badges만 포함하고, posts는 제외
    const group = await prisma.group.findUnique({
      where: { id: parseInt(groupId) },
      include: { 
        badges: true
      }
    });
    if (!group) return res.status(404).json({ message: "Group not found" });
    
    // 실제 게시글 수 계산
    const postsCount = await prisma.post.count({
      where: { groupId: parseInt(groupId) }
    });
    
    const responsePayload = {
      id: group.id,
      name: group.name,
      introduction: group.introduction,
      imageUrl: group.imageUrl,
      isPublic: group.isPublic,
      likeCount: group.likeCount,
      postCount: postsCount, // 계산된 게시글 수 사용
      createdAt: group.createdAt,
      badges: group.badges || []
    };

    res.json(JSON.parse(JSON.stringify(responsePayload)));
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
