'use strict';

module.exports = (sequelize, DataTypes) => {
  const profile = sequelize.define('profile', {
    userId: DataTypes.INTEGER,
    displayName: DataTypes.STRING,
    location: DataTypes.GEOMETRY,
    summary: DataTypes.TEXT,
    photo: {
      type: DataTypes.STRING,
      validate: {
        isUrl: true,
      },
    },
    desiredPaceId: DataTypes.INTEGER,
    desiredDistanceId: DataTypes.INTEGER,
  }, {});
  profile.associate = function profileAssociations(models) {
  };
  return profile;
};
