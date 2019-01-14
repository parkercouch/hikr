'use strict';

module.exports = (sequelize, DataTypes) => {
  const desiredDistance = sequelize.define('desiredDistance', {
    name: DataTypes.STRING,
  }, {});
  desiredDistance.associate = function desiredDistanceAssociations(models) {
  };
  return desiredDistance;
};
