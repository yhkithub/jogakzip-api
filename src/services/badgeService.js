
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const calculateUserBadges = async (userId) => {
  // 배지 계산 로직 구현
  return [];
};

module.exports = {
  calculateUserBadges
};
