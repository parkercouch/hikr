const express = require('express');

const router = express.Router();

// DATABASE
const Sequelize = require('sequelize');
const db = require('../models');

// eslint-disable-next-line prefer-destructuring
const Op = Sequelize.Op;


// MIDDLEWARE
const loggedIn = require('../middleware/loggedIn');

// GET /search -- show user profile
router.get('/', loggedIn, (req, res) => {
  db.matching.findAll({
    where: {
      userFromId: req.user.id,
    },
    attributes: ['userToId'],
  }).then((matchingUsers) => {
    const alreadyMatching = matchingUsers.map(u => u.userToId);
    alreadyMatching.push(req.user.id);

    db.profile.findAll({
      where: {
        [Op.and]: [
          { userId: { [Op.notIn]: alreadyMatching } },
          Sequelize.literal(`"desiredPace" & ${req.user.profile.desiredPace} != 0`),
          Sequelize.literal(`"desiredDistance" & ${req.user.profile.desiredDistance} != 0`),
        ],
      },
    }).then((foundUsers) => {
      if (!foundUsers.length) {
        req.flash('error', 'No one left to search through');
        req.flash('error', 'Talk to your current matches!');
        res.redirect('/conversation');
      }

      const nextUser = foundUsers[Math.floor(Math.random() * foundUsers.length)];
      res.render('search/search', { nextUser });
    }).catch((err) => {
      console.log(err);
    });
  }).catch((err) => {
    console.log(err);
  });
});

module.exports = router;
