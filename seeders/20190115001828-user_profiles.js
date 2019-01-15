'use strict';


const profiles = [...Array(100)].map((_, i) => {
  const pace = Math.floor(Math.random() * 8);
  const distance = Math.floor(Math.random() * 8);
  return {
    userId: i + 1,
    displayName: `User ${i + 1}`,
    location: 'Washington',
    summary: `Blah blah ${i + 1}`,
    photo: 'https://boygeniusreport.files.wordpress.com/2017/01/cat.jpg',
    desiredPace: pace,
    desiredDistance: distance,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
});

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('profiles', profiles, {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('profiles', null, {});
  },
};
