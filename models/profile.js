'use strict';

module.exports = (sequelize, DataTypes) => {
  const profile = sequelize.define('profile', {
    userId: DataTypes.INTEGER,
    displayName: DataTypes.STRING,
    location: DataTypes.GEOGRAPHY('POINT', 4326),
    summary: DataTypes.TEXT,
    photo: {
      type: DataTypes.STRING,
      validate: {
        isUrl: true,
      },
    },
    desiredPace: DataTypes.INTEGER,
    desiredDistance: DataTypes.INTEGER,
  }, {});
  profile.associate = function profileAssociations(models) {
  };
  return profile;
};
