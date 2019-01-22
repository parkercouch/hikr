'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    const profiles = [...Array(100)].map((_, i) => {
      const pace = Math.ceil(Math.random() * 8);
      const distance = Math.ceil(Math.random() * 8);
      return {
        userId: i + 1,
        displayName: `User ${i + 1}`,
        location: Sequelize.fn('ST_GeogFromText', 'POINT(-122.330833 47.606388)'),
        displayLocation: 'Seattle, WA',
        summary: `Blah blah ${i + 1}`,
        photo: 'https://res.cloudinary.com/deluxington/image/upload/b_rgb:c9c9c9,c_pad,h_500,w_1000/v1548108379/hikr_profile_photos/placeholder_photo.png',
        desiredPace: pace,
        desiredDistance: distance,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    });
    return queryInterface.bulkInsert('profiles', profiles, {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('profiles', null, {});
  },
};
