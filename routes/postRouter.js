// postRouter.js - Rev.-01
// Routes for post-related functionality

const express = require('express');
const postController = require('../controllers/postController');
const { ensureAuthenticated } = require('../middleware/authMiddleware'); // Middleware to protect routes

const router = express.Router();

// @route   GET /posts
// @desc    Fetch all posts for the feed
router.get('/', ensureAuthenticated, postController.getFeed);

// @route   GET /posts/:id
// @desc    Fetch a single post
router.get('/:id', ensureAuthenticated, postController.getPostById);

// @route   POST /posts
// @desc    Create a new post
router.post('/', ensureAuthenticated, postController.createPost);

// @route   POST /posts/:id/like
// @desc    Like a post
router.post('/:id/like', ensureAuthenticated, postController.likePost);

// @route   POST /posts/:id/comment
// @desc    Add a comment to a post
router.post('/:id/comment', ensureAuthenticated, postController.commentOnPost);

module.exports = router;
