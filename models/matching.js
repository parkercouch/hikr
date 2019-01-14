'use strict';
module.exports = (sequelize, DataTypes) => {
  const matching = sequelize.define('matching', {
    userFromId: DataTypes.INTEGER,
    userToId: DataTypes.INTEGER
  }, {});
  matching.associate = function(models) {
    // associations can be defined here
  };
  return matching;
};