const passport = require('passport');
const LocalStrategy = require('passport-local');

const db = require('../models');

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  db.user.findByPk(id).then((user) => {
    done(null, user);
  }).catch((err) => {
    done(err, null);
  });
});

passport.use(new LocalStrategy({
  emailField: 'email',
  passwordField: 'password',
}, (email, password, done) => {
  db.user.findOne({
    where: {
      email,
    },
  }).then((foundUser) => {
    if (foundUser && foundUser.isValidPassword(password)) {
      done(null, foundUser);
    } else {
      done(null, null);
    }
  }).catch(done);
}));


module.exports = passport;
