'use strict';

const distances = [
  {
    id: 1,
    name: 'Short',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 2,
    name: 'Medium',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 4,
    name: 'Long',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 8,
    name: 'Multi-day',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('desiredDistance', distances, {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('desiredDistance', null, {});
  },
};
