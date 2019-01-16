'use strict';

const conversations = [];

// Create 1-1815 conversations (the amount made in the other seed files)
for (let id = 1; id <= 1815; id += 1) {
  const name = `Conversation ${id}`;
  conversations.push({
    id,
    name,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
}
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('conversations', conversations, {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('conversations', null, {});
  },
};
