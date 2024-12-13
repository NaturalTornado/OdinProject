// validators.js - Rev.-01
// Utility functions for input validation

// Validate email format
exports.isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  
  // Validate password strength
  exports.isStrongPassword = (password) => {
    // Ensure password has at least 8 characters, one uppercase, one lowercase, and one digit
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    return passwordRegex.test(password);
  };
  
  // Validate username (alphanumeric, 3-20 characters)
  exports.isValidUsername = (username) => {
    const usernameRegex = /^[a-zA-Z0-9]{3,20}$/;
    return usernameRegex.test(username);
  };
  
  // Sanitize input to prevent script injection
  exports.sanitizeInput = (input) => {
    return input.replace(/</g, '&lt;').replace(/>/g, '&gt;');
  };
  
  // Validate non-empty string
  exports.isNonEmpty = (value) => {
    return typeof value === 'string' && value.trim().length > 0;
  };
  