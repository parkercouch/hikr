const express = require('express');

const router = express.Router();

// MIDDLEWARE
const loggedIn = require('../middleware/loggedIn');

// GET /search -- show user profile
router.get('/', loggedIn, (req, res) => {
  res.send('search');
});

module.exports = router;
