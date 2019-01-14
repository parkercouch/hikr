'use strict';
module.exports = (sequelize, DataTypes) => {
  const matched = sequelize.define('matched', {
    thisUserId: DataTypes.INTEGER,
    thatUserId: DataTypes.INTEGER
  }, {});
  matched.associate = function(models) {
    // associations can be defined here
  };
  return matched;
};