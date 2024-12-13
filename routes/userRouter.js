// userRouter.js - Rev.-06
const express = require('express');
const userController = require('../controllers/userController');
const { ensureAuthenticated } = require('../middleware/authMiddleware');

const router = express.Router();

// List all users
router.get('/', ensureAuthenticated, userController.getAllUsers);

// View user profile by username
router.get('/:username', ensureAuthenticated, userController.getUserProfileByUsername);

// Add a friend via AJAX
router.post('/api/friends/add', ensureAuthenticated, userController.addFriendAjax);

// Remove a friend via AJAX
router.post('/api/friends/remove', ensureAuthenticated, userController.removeFriendAjax);

// Update bio via AJAX
router.post('/api/profile/update-bio', ensureAuthenticated, userController.updateBioAjax);

// userRouter.js - Add this route
router.post('/api/messages/send', ensureAuthenticated, userController.sendMessage);

// userRouter.js - Add this route
router.get('/api/messages/:username', ensureAuthenticated, userController.getMessages);



module.exports = router;
