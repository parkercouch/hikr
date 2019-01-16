'use strict';

const randomWords = [
  'hello',
  'hi',
  'yo',
  'heya',
  'hola',
  '?',
  'ok',
  'no',
  'yes',
];

const messages = [];
let convId = 1;
const now = new Date();

// Create messages between first 10 users (who are all matched)
for (let x = 1; x <= 10; x += 1) {
  for (let y = x; y <= 10; y += 1) {
    if (x !== y) {
      let content = randomWords[Math.floor(Math.random() * randomWords.length)];
      messages.push({
        conversationId: convId,
        senderId: x,
        content,
        createdAt: now,
        updatedAt: now,
      });
      content = randomWords[Math.floor(Math.random() * randomWords.length)];
      messages.push({
        conversationId: convId,
        senderId: y,
        content,
        createdAt: now,
        updatedAt: now,
      });
      convId += 1;
      now.setSeconds(now.getSeconds() + 1);
    }
  }
}

// Create conversations if both id's are divisible by 3 or 2
for (let x = 11; x <= 100; x += 1) {
  for (let y = x; y <= 100; y += 1) {
    if (x !== y) {
      const match = (!(x % 2) || !(x % 3)) && (!(y % 2) || !(y % 3));
      if (match) {
        let content = randomWords[Math.floor(Math.random() * randomWords.length)];
        messages.push({
          conversationId: convId,
          senderId: x,
          content,
          createdAt: now,
          updatedAt: now,
        });
        content = randomWords[Math.floor(Math.random() * randomWords.length)];
        messages.push({
          conversationId: convId,
          senderId: y,
          content,
          createdAt: now,
          updatedAt: now,
        });
        convId += 1;
        now.setSeconds(now.getSeconds() + 1);
      }
    }
  }
}

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('messages', messages, {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('messages', null, {});
  },
};
