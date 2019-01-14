'use strict';

module.exports = (sequelize, DataTypes) => {
  const conversation = sequelize.define('conversation', {
    name: DataTypes.STRING,
  }, {});
  conversation.associate = function conversationAssociations(models) {
    models.conversation.belongsToMany(models.user, { through: 'userConversation' });
    models.conversation.hasMany(models.message);
  };
  return conversation;
};
