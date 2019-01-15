const express = require('express');
const db = require('../models');
const passport = require('../config/passportConfig');

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
  res.send('Sign Up Page');
  // res.render('auth/signup', { prevData: req.body, alerts: req.flash() });
}

// Form validation!
function signUpValidate(req, res, next) {
  if (req.body.password !== req.body.password_verify) {
    req.flash('error', 'Passwords must match!');
    return next();
  }
  db.user.findOrCreate({
    where: {
      username: req.body.username,
    },
    defaults: req.body,
  })
    .spread((user, wasCreated) => {
      if (wasCreated) {
        passport.authenticate('local', {
          successFlash: 'Welcome Home',
          successRedirect: '/profile',
          failureFlash: 'Invalid Credentials',
          failureRedirect: '/auth/login',
        })(req, res, () => {
          req.flash('success', 'Yay! You have conformed to our standards');
          return res.redirect('/profile');
        });
      }
      req.flash('error', 'You aren\'t unique. That username is already in use.');
      return res.redirect('/auth/signup');
    })
    .catch((err) => {
      if (err.errors) {
        err.errors.forEach((e) => {
          if (e.type === 'Validation error') {
            req.flash('error', e.message);
          } else {
            console.log('Not validation error: ', e);
          }
        });
        return next();
      }
      console.log('Error: ', err);
      req.flash('error', 'A server error occured. Please try again. Or don\'t...');
      return res.render('error');
    });
  // WILL THIS BREAK THIS?
  return 0;
}

// SIGNUP //
// GET - /auth/signup
router.get('/signup', signUpForm);

// POST /auth/signup -- Validate sign up data and redirect to sign up form if it fails
router.post('/signup', signUpValidate, signUpForm);


module.exports = router;
