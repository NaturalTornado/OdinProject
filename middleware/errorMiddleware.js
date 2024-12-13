// errorMiddleware.js - Rev.-01
// Middleware for centralized error handling

exports.handle404 = (req, res, next) => {
    res.status(404).render('errors/404', { message: 'Page not found.' });
  };
  
  exports.handleErrors = (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).render('errors/500', { message: 'Something went wrong. Please try again.' });
  };
  