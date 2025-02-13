// prisma/updateMoment.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // 모든 게시글의 moment 필드를 특정 날짜로 업데이트 (예시: 2025-02-13)
  const updatedPosts = await prisma.post.updateMany({
    where: {
      // moment가 null인 경우만 업데이트 (원하는 조건에 따라 조정)
      moment: null
    },
    data: {
      moment: new Date("2025-02-13T00:00:00.000Z")
    }
  });
  
  console.log("업데이트된 게시글 수:", updatedPosts.count);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
