// flashMiddleware.js - Rev.-01
module.exports = (req, res, next) => {
    req.flash = (type, message) => {
      if (!req.session.flash) req.session.flash = {};
      req.session.flash[type] = message;
    };
  
    next();
  };
  