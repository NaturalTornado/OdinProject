// faker.js - Rev.-01
// Script to seed the database with fake data

const { faker } = require('@faker-js/faker');
const prisma = require('./prismaClient'); // Prisma client for database interaction
const bcrypt = require('bcrypt'); // To hash passwords for users

// Seed function
const seedDatabase = async () => {
  try {
    console.log('Seeding database...');

    // Create users
    for (let i = 0; i < 10; i++) {
      const username = faker.internet.userName();
      const email = faker.internet.email();
      const password = await bcrypt.hash('password123', 10); // Use hashed password for testing
      const bio = faker.lorem.sentence(); // Random bio

      await prisma.user.create({
        data: {
          username,
          email,
          password,
          profile: {
            create: { bio, avatarUrl: faker.image.avatar() },
          },
        },
      });
    }

    console.log('Users created.');

    // Create posts
    const users = await prisma.user.findMany();
    for (const user of users) {
      for (let i = 0; i < 5; i++) {
        await prisma.post.create({
          data: {
            content: faker.lorem.paragraph(),
            authorId: user.id,
          },
        });
      }
    }

    console.log('Posts created.');

    // Create comments
    const posts = await prisma.post.findMany();
    for (const post of posts) {
      for (let i = 0; i < 3; i++) {
        const randomUser = users[Math.floor(Math.random() * users.length)];
        await prisma.comment.create({
          data: {
            content: faker.lorem.sentence(),
            authorId: randomUser.id,
            postId: post.id,
          },
        });
      }
    }

    console.log('Comments created.');

    console.log('Database seeding completed successfully.');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await prisma.$disconnect();
  }
};

// Run the seed function
seedDatabase();
