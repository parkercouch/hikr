'use strict';

module.exports = (sequelize, DataTypes) => {
  const profile = sequelize.define('profile', {
    userId: DataTypes.INTEGER,
    displayName: DataTypes.STRING,
    location: DataTypes.STRING,
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
