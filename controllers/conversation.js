const express = require('express');

const router = express.Router();

// MIDDLEWARE
const loggedIn = require('../middleware/loggedIn');

// GET /conversation -- Show list of conversation (matched people)
router.get('/', loggedIn, (req, res) => {
  res.send('Conversation List');
});

// GET /conversation/:idx -- Show specific conversation
router.get('/', loggedIn, (req, res) => {
  res.send(`Conversation ${req.params.idx}`);
});

module.exports = router;
