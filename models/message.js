'use strict';

module.exports = (sequelize, DataTypes) => {
  const message = sequelize.define('message', {
    senderId: DataTypes.INTEGER,
    reveiverId: DataTypes.INTEGER,
    content: DataTypes.TEXT
  }, {});
  message.associate = function messageAssociations(models) {
    models.message.belongsTo(models.user, { as: 'sender' });
    models.message.belongsTo(models.user, { as: 'receiver' });
    // associations can be defined here
  };
  return message;
};

