const express = require('express');

const router = express.Router();

// MIDDLEWARE
const loggedIn = require('../middleware/loggedIn');

// GET /user -- redirect to search
router.get('/', loggedIn, (req, res) => {
  res.redirect('/search');
});

// GET /user/:idx -- show user profile
router.get('/:idx', loggedIn, (req, res) => {
  res.send(`User ${req.params.idx}`);
});

module.exports = router;
