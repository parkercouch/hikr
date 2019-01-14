'use strict';

module.exports = (sequelize, DataTypes) => {
  const message = sequelize.define('message', {
    senderId: DataTypes.INTEGER,
    conversationId: DataTypes.INTEGER,
    content: DataTypes.TEXT,
  }, {});
  message.associate = function messageAssociations(models) {

  };
  return message;
};
