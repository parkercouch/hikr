const passport = require('passport');
const LocalStrategy = require('passport-local');

const db = require('../models');

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  db.user.findOne({
    where: { id },
    include: [db.profile, {
      model: db.conversation,
      attributes: ['id'],
    },
    ],
  }).then((user) => {
    // ? This probably should only happen when going to certain pages instead of all
    if (user) {
      user.conversations = user.conversations.map(c => c.id);
    }
    done(null, user);
  }).catch((err) => {
    done(err, null);
  });
});

passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
}, (email, password, done) => {
  db.user.findOne({
    where: {
      email,
    },
    include: [db.profile],
  }).then((foundUser) => {
    if (foundUser && foundUser.isValidPassword(password)) {
      done(null, foundUser);
    } else {
      done(null, null);
    }
  }).catch(done);
}));


module.exports = passport;
