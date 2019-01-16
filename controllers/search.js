const express = require('express');

const router = express.Router();

// DATABASE
const db = require('../models');

// MIDDLEWARE
const loggedIn = require('../middleware/loggedIn');

// GET /search -- show user profile
router.get('/', loggedIn, (req, res) => {
  db.profile.findAll().then((foundUsers) => {
    const nextUser = foundUsers[Math.floor(Math.random() * foundUsers.length)];
    res.render('search/search', { nextUser });
  }).catch((err) => {
    console.log(err);
  });
});

module.exports = router;
