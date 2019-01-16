const express = require('express');

const router = express.Router();

// DATABASE
const db = require('../models');
const Op = require('sequelize').Op;
const Sequelize = require('sequelize');


// MIDDLEWARE
const loggedIn = require('../middleware/loggedIn');

// GET /search -- show user profile
router.get('/', loggedIn, (req, res) => {
  console.log(req.user.id);
  db.matching.findAll({
    where: {
      userFromId: req.user.id,
    },
    attributes: ['userToId'],
  }).then((matchingUsers) => {
    console.log(matchingUsers);
    const alreadyMatching = matchingUsers.map(u => u.userToId);
    alreadyMatching.push(req.user.id);
    const pace = 8;
    const distance = 3;
    console.log(alreadyMatching);

    db.profile.findAll({
      where: {
        [Op.and]: [
          { userId: { [Op.notIn]: alreadyMatching } },
          Sequelize.literal(`"desiredPace" & ${pace} != 0`),
          // WHERE "desiredPace" & 8 != 0
          Sequelize.literal(`"desiredDistance" & ${distance} != 0`),
        ],
      },
    }).then((foundUsers) => {
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
