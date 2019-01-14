'use strict';

// Test users with not meaningful but valid data

const users = [];

for (let x = 0; x < 100; x += 1) {
  const year = 1900 + x;
  const month = 10;
  const day = 15;

  users.push({
    firstName: `User ${x}`,
    lastName: 'Person',
    email: `me${x}@email.com`,
    password: 'password',
    dob: new Date(year, month, day),
    createdAt: new Date(),
    updatedAt: new Date(),
  });
}

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('user', users, {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('user', null, {});
  },
};
