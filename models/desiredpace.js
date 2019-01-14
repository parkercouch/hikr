'use strict';
module.exports = (sequelize, DataTypes) => {
  const desiredPace = sequelize.define('desiredPace', {
    name: DataTypes.STRING
  }, {});
  desiredPace.associate = function(models) {
    // associations can be defined here
  };
  return desiredPace;
};