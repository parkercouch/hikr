'use strict';

module.exports = (sequelize, DataTypes) => {
  const userConversation = sequelize.define('userConversation', {
    userId: DataTypes.INTEGER,
    conversationId: DataTypes.INTEGER,
  }, {});
  userConversation.associate = function userConversationAssociations(models) {
  };
  return userConversation;
};
