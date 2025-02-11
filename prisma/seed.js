  // prisma/seed.js
  const { PrismaClient } = require("@prisma/client");
  const prisma = new PrismaClient();

  async function main() {
    // 그룹 생성
    const group = await prisma.group.create({
      data: {
        name: "Test Group",
        imageUrl: "https://example.com/group.jpg",
        introduction: "테스트 그룹입니다.",
        isPublic: true,
        password: "secret",
      },
    });
    console.log("Group created:", group);

    // 게시물 생성 (위 그룹에 연결)
    const post = await prisma.post.create({
      data: {
        groupId: group.id,
        nickname: "Tester",
        title: "Test Post",
        content: "이것은 테스트 게시물입니다.",
        imageUrl: "https://example.com/post.jpg",
        tags: "테스트,샘플",
        location: "Seoul",
        isPublic: true,
        password: "1234",
      },
    });
    console.log("Post created:", post);

    // 댓글 생성
    const comment = await prisma.comment.create({
      data: {
        postId: post.id,
        nickname: "Commenter",
        content: "테스트 댓글입니다.",
        password: "abcd",
      },
    });
    console.log("Comment created:", comment);
  }

  main()
    .catch((e) => {
      console.error(e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
