const express = require('express');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const db = require('../models');
require('dotenv').load();

const Op = require('sequelize').Op;

const geocodingClient = mbxGeocoding({ accessToken: process.env.MAPBOX_TOKEN });
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
router.get('/edit', loggedIn, async (req, res) => {
  res.render('profile/edit', { profile: req.user.profile });
});

// GET /profile/delete -- Show delete warning
router.get('/delete', loggedIn, (req, res) => {
  res.render('profile/delete');
});

// PUT /profile -- update users profile
router.put('/', loggedIn, async (req, res) => {
  const updatedProfile = req.body;

  // If there are new coords then format for sequelize
  if (updatedProfile.lat && updatedProfile.long) {
    updatedProfile.location = {
      type: 'Point',
      coordinates: [updatedProfile.long, updatedProfile.lat],
    };
    // Set to 0 to have deleted below
    updatedProfile.lat = 0;
    updatedProfile.long = 0;
  }

  if (updatedProfile.desiredPace) {
    if (updatedProfile.desiredPace.length > 1) {
      updatedProfile.desiredPace = updatedProfile.desiredPace
        .map(s => +s).reduce((a, b) => a + b);
    } else {
      updatedProfile.desiredPace = +updatedProfile.desiredPace;
    }
  }

  if (updatedProfile.desiredDistance) {
    if (updatedProfile.desiredDistance.length > 1) {
      updatedProfile.desiredDistance = updatedProfile.desiredDistance
        .map(s => +s).reduce((a, b) => a + b);
    } else {
      updatedProfile.desiredDistance = +updatedProfile.desiredDistance;
    }
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
router.delete('/', loggedIn, async (req, res) => {
  // Gather needed data in object
  const info = {
    deletedUserId: req.user.id,
    conversations: req.user.conversations,
  };
  // Log user out
  req.logout();

  // Remove all messages by user
  try {
    // Remove all messages where user is involved
    await db.message.destroy({
      where: {
        conversationId: { [Op.in]: info.conversations },
      },
    });

    // Remove the conversations user is apart of
    await db.conversation.destroy({
      where: {
        id: { [Op.in]: info.conversations },
      },
    });

    // Remove all connnections associated with the conversation
    await db.userConversation.destroy({
      where: {
        conversationId: { [Op.in]: info.conversations },
      },
    });

    // Remove all matches involving user
    await db.matching.destroy({
      where: {
        [Op.or]: [
          { userToId: info.deletedUserId },
          { userFromId: info.deletedUserId },
        ],
      },
    });

    // Remove profile
    await db.profile.destroy({
      where: {
        userId: info.deletedUserId,
      },
    });

    // Remove user
    await db.user.destroy({
      where: {
        id: info.deletedUserId,
      },
    });
  } catch (error) {
    console.log(error);
  }
  return res.redirect('/');
});

// GET /profile/location -- Show location search bar
router.get('/location', loggedIn, (req, res) => {
  res.render('profile/location_search');
});

// GET /profile/location-selector -- Show results of city search
router.get('/location-selector', loggedIn, (req, res) => {
  geocodingClient
    .forwardGeocode({
      query: `${req.query.city}, ${req.query.state}`,
      types: ['place'],
      countries: ['us'],
    })
    .send()
    .then((response) => {
      const results = response.body.features.map((city) => {
        const placeName = city.place_name.split(', ');
        return {
          city: placeName[0],
          state: placeName[1],
          lat: city.center[1],
          long: city.center[0],
        };
      });
      res.render('profile/location_selector', { results });
    })
    .catch((err) => {
      console.log(err);
    });
});


module.exports = router;
