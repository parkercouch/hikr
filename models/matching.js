'use strict';

module.exports = (sequelize, DataTypes) => {
  const matching = sequelize.define('matching', {
    userFromId: DataTypes.INTEGER,
    userToId: DataTypes.INTEGER,
  }, {});
  matching.associate = function matchingAssociations(models) {
  };
  return matching;
};
