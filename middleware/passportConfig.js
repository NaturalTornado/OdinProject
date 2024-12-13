// passportConfig.js - Rev.-01
// Configuration for Passport.js Local Strategy

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const prisma = require('../prismaClient'); // Import Prisma client

// Configure Local Strategy
passport.use(
  new LocalStrategy(
    { usernameField: 'email', passwordField: 'password' }, // Specify form fields
    async (email, password, done) => {
      try {
        // Find user by email
        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
          return done(null, false, { message: 'Incorrect email or password.' });
        }

        // Compare password with hashed password in DB
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return done(null, false, { message: 'Incorrect email or password.' });
        }

        // Successful authentication
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

// Serialize user (store user ID in session)
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user (retrieve user details from session)
passport.deserializeUser(async (id, done) => {
  try {
    const user = await prisma.user.findUnique({ where: { id } });
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

module.exports = passport;
