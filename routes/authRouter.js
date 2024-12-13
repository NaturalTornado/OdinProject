// authRouter.js - Rev.-02
// Handles routes for authentication

const express = require('express');
const passport = require('passport');
const authController = require('../controllers/authController'); // Authentication controller

const router = express.Router();

// @route   GET /auth/login
// @desc    Render login page
router.get('/login', (req, res) => {
  res.render('auth/login', { title: 'Login' });
});

// @route   POST /auth/login
// @desc    Authenticate user and redirect
router.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/posts', // Redirect to feed on success
    failureRedirect: '/auth/login', // Redirect back to login on failure
    failureFlash: true, // Enable flash messages
  })
);

// @route   GET /auth/register
// @desc    Render registration page
router.get('/register', (req, res) => {
  res.render('auth/register', { title: 'Register' });
});

// @route   POST /auth/register
// @desc    Handle user registration
router.post('/register', authController.registerUser);

// @route   GET /auth/logout
// @desc    Log out user and redirect to login
router.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error('Logout error:', err);
      req.flash('error', 'Failed to log out. Please try again.');
      return res.redirect('/posts');
    }
    req.flash('success', 'You have logged out successfully.');
    res.redirect('/auth/login');
  });
});

module.exports = router;
