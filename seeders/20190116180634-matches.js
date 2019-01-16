'use strict';

const matches = [];

// Match first 10 users with each other
for (let x = 1; x <= 10; x += 1) {
  for (let y = 1; y <= 10; y += 1) {
    if (x !== y) {
      matches.push({
        userFromId: x,
        userToId: y,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
  }
}

// Match if both id's are divisible by 3 or 2
for (let x = 11; x <= 100; x += 1) {
  for (let y = 11; y <= 100; y += 1) {
    if (x !== y) {
      const match = (!(x % 2) || !(x % 3)) && (!(y % 2) || !(y % 3));
      if (match) {
        matches.push({
          userFromId: x,
          userToId: y,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }
    }
  }
}

// Match user 11 with everyone (but no one matches back) to test on match
{
  const userFromId = 11;
  for (let userToId = 1; userToId <= 100; userToId += 1) {
    if (userToId !== userFromId) {
      matches.push({
        userFromId,
        userToId,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
  }
}

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('matchings', matches, {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('matchings', null, {});
  },
};
