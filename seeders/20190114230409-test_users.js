'use strict';

const bcrypt = require('bcryptjs');

// Test users with not meaningful but valid data

const users = [];

for (let x = 0; x < 100; x += 1) {
  const year = 1900 + x;
  const month = 10;
  const day = 15;
  const hashedPW = bcrypt.hashSync('password', 12);

  users.push({
    firstName: `User ${x + 1}`,
    lastName: 'Person',
    email: `me${x + 1}@email.com`,
    password: hashedPW,
    dob: new Date(year, month, day),
    createdAt: new Date(),
    updatedAt: new Date(),
  });
}

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('users', users, {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('users', null, {});
  },
};
