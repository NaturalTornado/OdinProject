// authMiddleware.js - Rev.-03
// Middleware for authentication and injecting user data

const prisma = require('../prismaClient'); // Adjust the path as necessary

/**
 * Middleware to inject user data into all views.
 * Fetches all users and the current user's friends for authenticated users.
 */
async function injectUserData(req, res, next) {
  if (req.isAuthenticated()) {
    try {
      // Fetch all users
      const users = await prisma.user.findMany();

      // Fetch current user's friends
      const friends = await prisma.friend.findMany({
        where: { userId: req.user.id },
        include: { friend: true },
      });

      // Attach data to res.locals for access in views
      res.locals.users = users; // All users in the database
      res.locals.friends = friends.map((f) => f.friend); // Current user's friends
    } catch (error) {
      console.error('Error in injectUserData middleware:', error);
    }
  }
  next();
}

/**
 * Middleware to ensure a user is authenticated.
 * Redirects unauthenticated users to the login page.
 */
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login'); // Redirect to login if not authenticated
}

module.exports = {
  injectUserData,
  ensureAuthenticated,
};
