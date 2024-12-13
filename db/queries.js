// queries.js - Rev.-01
// Reusable database queries using Prisma Client

const prisma = require('../prismaClient'); // Main directory's prismaClient.js

// Fetch all users
exports.getAllUsers = async () => {
  return prisma.user.findMany({
    include: {
      profile: true,
      posts: true,
    },
  });
};

// Fetch user by ID
exports.getUserById = async (id) => {
  return prisma.user.findUnique({
    where: { id: parseInt(id, 10) },
    include: {
      profile: true,
      posts: true,
    },
  });
};

// Fetch all posts
exports.getAllPosts = async () => {
  return prisma.post.findMany({
    include: {
      author: { select: { username: true } },
      comments: true,
      likes: true,
    },
  });
};

// Add more queries as needed
