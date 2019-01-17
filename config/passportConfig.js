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
    // console.log(user.conversations);
    user.conversations = user.conversations.map(c => c.id);
    // console.log(user.conversations);
    // console.log(user.profile);
    // user.profile = user.profile.map((p) => {
    //   return {
    //     displayName: p.displayName,
    //     location: p.location,
    //     summary: p.summary,
    //     photo: p.photo,
    //     desiredPace: p.desiredPace,
    //     desiredDistance: p.desiredDistance,
    //   };
    // });
    // console.log(user.profile);
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
    console.log(foundUser.profile.desiredPace);
    if (foundUser && foundUser.isValidPassword(password)) {
      done(null, foundUser);
    } else {
      done(null, null);
    }
  }).catch(done);
}));


module.exports = passport;
