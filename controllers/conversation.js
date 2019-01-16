
const express = require('express');

const router = express.Router();

const db = require('../models');
const Op = require('sequelize').Op;

// MIDDLEWARE
const loggedIn = require('../middleware/loggedIn');

// GET /conversation -- Show list of conversation (matched people)
router.get('/', loggedIn, (req, res) => {
  // get users conversation and link to them
  db.user.findOne({
    where: {
      id: req.user.id,
    },
    include: [
      {
        model: db.conversation,
        // as: 'conversation',
        include: [
          {
            model: db.user,
            // as: 'Connection',
            attributes: [
              'id',
            ],
            where: {
              id: {
                [Op.ne]: req.user.id,
              },
            },
            include: [db.profile],
          },
        ],
      },
    ],
  }).then((foundUser) => {
    // console.log(foundUser.conversations[0].users);
    res.render('conversation/list', { conversations: foundUser.conversations });
  }).catch((err) => {
    res.render('error');
  });
});

// GET /conversation/:idx -- Show specific conversation
router.get('/:idx', loggedIn, (req, res) => {
  db.conversation.findOne({
    where: {
      id: req.params.idx,
    },
    include: [db.message, { model: db.user, where: { id: { [Op.ne]: req.user.id } }, include: [db.profile] }],
  }).then((conversation) => {
    // filter sender and receiver (for easier formatting)
    // **Order by timestamp (will need to add autoscroll to bottom and limit to amount)
    const messages = conversation.messages.map((m) => {
      return {
        sent: (m.senderId === req.user.id),
        content: m.content,
        timestamp: m.createdAt,
      };
    });
    const contact = conversation.users[0].profile;

    res.render('conversation/chat', { contact, messages, convId: conversation.id });
  }).catch((err) => {
    console.log(`Error: ${err}`);
    res.render('error');
  });
});

module.exports = router;
