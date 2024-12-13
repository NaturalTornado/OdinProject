// app.js - Rev.-03
// Main application setup

require('dotenv').config(); // Load environment variables
const express = require('express');
const session = require('express-session');
const passport = require('./middleware/passportConfig'); // Passport configuration
const flashMiddleware = require('./middleware/flashMiddleware'); // Custom flash middleware
const path = require('path');
const { handle404, handleErrors } = require('./middleware/errorMiddleware'); // Error handling middleware

// Import Routers
const authRouter = require('./routes/authRouter');
const userRouter = require('./routes/userRouter');
const indexRouter = require('./routes/indexRouter');
const postRouter = require('./routes/postRouter');

const app = express();

// Middleware
app.set('view engine', 'ejs'); // Set EJS as template engine
app.set('views', path.join(__dirname, 'views')); // Set views directory

app.locals.layout = true; // Set default layout behavior

app.use(express.static(path.join(__dirname, 'public'))); // Serve static files
app.use(express.urlencoded({ extended: false })); // Parse form data
app.use(express.json()); // Parse JSON data

// Session configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'defaultsecret',
    resave: false,
    saveUninitialized: true,
  })
);

// Custom flash middleware
app.use(flashMiddleware);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Custom Middleware to Pass Flash Messages and User Info to Views
app.use((req, res, next) => {
  res.locals.success = req.session.flash?.success || null;
  res.locals.error = req.session.flash?.error || null;
  res.locals.user = req.user || null;
  req.session.flash = null; // Clear flash messages after they are used
  next();
});

// Routes
app.use('/', indexRouter); // Public homepage or redirect
app.use('/auth', authRouter); // Authentication routes
app.use('/users', userRouter); // User management routes
app.use('/posts', postRouter); // Post management routes

// Error Handling
app.use(handle404); // Handle 404 errors
app.use(handleErrors); // Handle other errors

// Start the Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
