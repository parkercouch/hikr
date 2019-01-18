const express = require('express');
const db = require('../models');

const router = express.Router();

// MIDDLEWARE
const loggedIn = require('../middleware/loggedIn');

// GET /profile -- show user profile
router.get('/', loggedIn, (req, res) => {
  // res.send('Profile');
  db.profile.findOne({
    where: {
      userId: req.user.id,
    },
  }).then((profile) => {
    return res.render('profile/profile', { profile });
  }).catch((error) => {
    return res.render('error', { error });
  });
});

// GET /profile/edit -- show edit form for users profile
router.get('/edit', loggedIn, (req, res) => {
  res.render('profile/edit');
});

// GET /profile/delete -- Show delete warning with text input to validate
router.get('/delete', loggedIn, (req, res) => {
  res.send(`Do you want to delete ${req.user.id}`);
});

// PUT /profile -- update users profile
router.put('/', loggedIn, async (req, res) => {
  const updatedProfile = req.body;

  if (updatedProfile.desiredPace.length > 1) {
    updatedProfile.desiredPace = updatedProfile.desiredPace
      .map(s => +s).reduce((a, b) => a + b);
  } else {
    updatedProfile.desiredPace = +updatedProfile.desiredPace;
  }

  if (updatedProfile.desiredDistance.length > 1) {
    updatedProfile.desiredDistance = updatedProfile.desiredDistance
      .map(s => +s).reduce((a, b) => a + b);
  } else {
    updatedProfile.desiredDistance = +updatedProfile.desiredDistance;
  }

  // Remove all empty props so not added to db
  Object.keys(updatedProfile).forEach((key) => {
    if (!updatedProfile[key]) {
      delete updatedProfile[key];
    }
  });

  try {
    await db.profile.update(
      updatedProfile,
      { where: { userId: req.user.id } },
    );
  } catch (err) {
    req.flash('error', 'There was a problem updating your profile. Try again!');
    console.log(err);
  }

  return res.redirect('/profile');
});

// DELETE /profile -- delete user and all their connections
router.delete('/profile', loggedIn, (req, res) => {
  res.send(`Deleting ${req.user.id}`);
});

module.exports = router;
