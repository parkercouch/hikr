'use strict';

module.exports = (sequelize, DataTypes) => {
  const desiredPace = sequelize.define('desiredPace', {
    name: DataTypes.STRING,
  }, {});
  desiredPace.associate = function desiredPaceAssociations(models) {
  };
  return desiredPace;
};
