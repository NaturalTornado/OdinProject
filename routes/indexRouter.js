// indexRouter.js - Rev.-03
// Handles routes for the homepage and public views

const express = require('express');
const router = express.Router();

// @route   GET /
// @desc    Render public homepage or redirect to feed if logged in
router.get('/', (req, res) => {
  if (req.isAuthenticated()) {
    return res.redirect('/posts'); // Redirect authenticated users to their feed
  }
  res.render('home', { title: 'Welcome to OdinBook' }); // Render a public homepage
});

module.exports = router;
