const express = require('express');
const db = require('../models');
const passport = require('../config/passportConfig');
const Sequelize = require('sequelize');

const router = express.Router();

// LOGIN
// GET /auth/login -- show login page
router.get('/login', (req, res) => {
  res.render('auth/login');
});

// POST - /auth/login -- authenticate login
router.post('/login', passport.authenticate('local', {
  successFlash: 'Welcome Home',
  successRedirect: '/profile',
  failureFlash: 'Invalid Credentials',
  failureRedirect: '/auth/login',
}));

// LOGOUT //
// GET /auth/logout -- Log user out
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success', 'Why did you leave me? :(');
  res.redirect('/');
});


// FUNCTIONS //

// Callback used in to display sign up form
function signUpForm(req, res) {
  res.render('auth/signup', { prevData: req.body, alerts: req.flash() });
}

// Form validation!
async function signUpValidate(req, res, next) {
  if (req.body.password !== req.body.password_verify) {
    req.flash('error', 'Passwords must match!');
    return next();
  }

  // Make a new user. If one is found then the email must already be in use
  try {
    const [newUser, wasCreated] = await db.user.findOrCreate({
      where: { email: req.body.email },
      defaults: req.body,
    });

    if (wasCreated) {
      // Create default profile
      await db.profile.create({
        userId: newUser.id,
        displayName: newUser.firstName,
        location: Sequelize.fn('ST_GeogFromText', 'POINT(-122.330833 47.606388)'),
        displayLocation: 'Seattle, WA',
        summary: 'No bio has been added yet',
        photo: 'https://res.cloudinary.com/deluxington/image/upload/b_rgb:c9c9c9,c_pad,h_500,w_1000/v1548108379/hikr_profile_photos/placeholder_photo.png',
        desiredPace: 0,
        desiredDistance: 0,
      });

      // Log user in and direct to profile edit
      return passport.authenticate('local', {
        successFlash: 'Welcome! Time to make your profile.',
        successRedirect: '/profile/edit',
        failureFlash: 'Invalid Credentials',
        failureRedirect: '/auth/login',
      })(req, res, next);
    }
  } catch (error) {
    if (error.errors) {
      error.errors.forEach((e) => {
        if (e.type === 'Validation error') {
          req.flash('error', e.message);
        } else {
          console.log('Not validation error: ', e);
        }
      });
      return next();
    }
    console.log('Error: ', error);
    req.flash('error', 'A server error occured. Please try again.');
    return res.render('error');
  }

  req.flash('error', 'That email is already in use!');
  return next();
}

// SIGNUP //
// GET - /auth/signup
router.get('/signup', signUpForm);

// POST /auth/signup -- Validate sign up data and redirect to sign up form if it fails
router.post('/signup', signUpValidate, signUpForm);


module.exports = router;
