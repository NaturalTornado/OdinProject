// prismaClient.js - Rev.-02
// Centralized Prisma Client configuration

require('dotenv').config(); // Load environment variables

const { PrismaClient } = require('@prisma/client');

// Initialize Prisma Client with the database URL from environment variables
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL, // Load DATABASE_URL from .env
    },
  },
});

module.exports = prisma;

// Usage Example:
// const prisma = require('./prismaClient');
// prisma.user.findMany();
