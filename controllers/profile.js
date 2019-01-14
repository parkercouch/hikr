const express = require('express');

const router = express.Router();

// MIDDLEWARE
const loggedIn = require('../middleware/loggedIn');

// GET /profile -- show user profile
router.get('/', loggedIn, (req, res) => {
  res.send('Profile');
  // res.render('profile');
});

module.exports = router;
