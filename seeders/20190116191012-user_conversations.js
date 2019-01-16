'use strict';

const conversations = [];
let convId = 1;

// Create conversations between first 10 users (who are all matched)

for (let x = 1; x <= 10; x += 1) {
  for (let y = x; y <= 10; y += 1) {
    if (x !== y) {
      conversations.push({
        conversationId: convId,
        userId: x,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      conversations.push({
        conversationId: convId,
        userId: y,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      convId += 1;
    }
  }
}

// Create conversations if both id's are divisible by 3 or 2
for (let x = 11; x <= 100; x += 1) {
  for (let y = x; y <= 100; y += 1) {
    if (x !== y) {
      const match = (!(x % 2) || !(x % 3)) && (!(y % 2) || !(y % 3));
      if (match) {
        conversations.push({
          conversationId: convId,
          userId: x,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        conversations.push({
          conversationId: convId,
          userId: y,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        convId += 1;
      }
    }
  }
}

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('userConversations', conversations, {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('userConversations', null, {});
  },
};
