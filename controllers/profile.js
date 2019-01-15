const express = require('express');

const router = express.Router();

// MIDDLEWARE
const loggedIn = require('../middleware/loggedIn');

// GET /profile -- show user profile
router.get('/', loggedIn, (req, res) => {
  // res.send('Profile');
  res.render('profile/profile');
});

// GET /profile/edit -- show edit form for users profile
router.get('/edit', loggedIn, (req, res) => {
  res.send('Profile Edit');
});

// GET /profile/delete -- Show delete warning with text input to validate
router.get('/delete', loggedIn, (req, res) => {
  res.send(`Do you want to delete ${req.user.id}`);
});

// PUT /profile -- update users profile
router.put('/', loggedIn, (req, res) => {
  // req.user.id to target specific profile
  res.send(`Updating ${req.user.id}'s profile`);
});

// DELETE /profile -- delete user and all their connections
router.delete('/profile', loggedIn, (req, res) => {
  res.send(`Deleting ${req.user.id}`);
});

module.exports = router;
