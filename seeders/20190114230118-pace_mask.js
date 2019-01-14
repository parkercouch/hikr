'use strict';

const paces = [
  {
    id: 1,
    name: 'Leisurely',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 2,
    name: 'Casual',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 4,
    name: 'Brisk',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 8,
    name: 'Running',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('desiredPace', paces, {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('desiredPace', null, {});
  },
};
